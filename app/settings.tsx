import CustomText from '@/components/CustomText';
import { commonStyles } from '@/constants/commonStyles';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Modal, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const router = useRouter();
    const { t, i18n: i18nInstance } = useTranslation();
    
    console.log('Current i18n language:', i18nInstance?.language);
    const { 
        colors, 
        themeMode, 
        setThemeMode, 
        notificationsEnabled, 
        setNotificationsEnabled 
    } = useTheme();

    const [languageModalVisible, setLanguageModalVisible] = useState(false);

    const languages = useMemo(() => [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'Hindi (हिंदी)' },
        { code: 'ja', label: 'Japanese (日本語)' },
        { code: 'fr', label: 'French (Français)' },
    ], []);

    const currentLanguage = i18nInstance?.language?.split('-')[0] || 'en';
    const currentLanguageLabel = useMemo(() => 
        languages.find(l => l.code === currentLanguage)?.label || 'English'
    , [languages, currentLanguage]);

    const changeLanguage = useCallback(async (code: string) => {
        if (i18nInstance?.changeLanguage) {
            try {
                await i18nInstance.changeLanguage(code);
                await AsyncStorage.setItem('user-language', code);
            } catch (err) {
                console.error('Failed to change language:', err);
            }
        }
        setLanguageModalVisible(false);
    }, [i18nInstance]);

    const SettingItem = ({
        icon,
        label,
        onPress,
        value
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        onPress?: () => void;
        value?: string;
    }) => (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name={icon} size={22} color={colors.primary} />
            </View>
            <CustomText variant="body" style={styles.label}>{label}</CustomText>
            {value && <CustomText variant="body" style={{ color: colors.textMuted, marginRight: 8 }}>{value}</CustomText>}
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
    );

    return (
        <View style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <CustomText variant="heading" style={{ fontSize: 24 }}>{t('settings.title')}</CustomText>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <CustomText variant="caption" style={styles.sectionTitle}>{t('settings.preferences')}</CustomText>
                    <SettingItem 
                        icon={themeMode === 'dark' ? 'moon' : themeMode === 'light' ? 'sunny-outline' : 'settings-outline'} 
                        label={t('settings.themeMode')} 
                        value={t(`settings.${themeMode}`)}
                        onPress={() => {
                            const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
                            const nextIndex = (modes.indexOf(themeMode) + 1) % modes.length;
                            setThemeMode(modes[nextIndex]);
                        }}
                    />
                    <SettingItem 
                        icon={notificationsEnabled ? "notifications" : "notifications-off-outline"} 
                        label={t('settings.notifications')} 
                        value={notificationsEnabled ? t('settings.enabled') : t('settings.disabled')} 
                        onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                    />
                    <SettingItem 
                        icon="language-outline" 
                        label={t('settings.language')} 
                        value={currentLanguageLabel}
                        onPress={() => setLanguageModalVisible(true)}
                    />
                </View>


                <View style={styles.section}>
                    <CustomText variant="caption" style={styles.sectionTitle}>{t('settings.about')}</CustomText>
                    <SettingItem icon="information-circle-outline" label={t('settings.version')} value="1.0.0" />
                    <SettingItem icon="star-outline" label={t('settings.rateApp')} />
                    <SettingItem icon="mail-outline" label={t('settings.contactSupport')} />
                </View>

                <View style={[styles.footer, { marginTop: 40 }]}>
                    <CustomText variant="caption" style={{ textAlign: 'center', opacity: 0.5 }}>
                        {t('settings.madeWithVibe')}
                    </CustomText>
                </View>
            </ScrollView>

            <Modal
                visible={languageModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setLanguageModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setLanguageModalVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <CustomText variant="heading" style={styles.modalTitle}>{t('settings.selectLanguage')}</CustomText>
                        <FlatList
                            data={languages}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.languageOption} 
                                    onPress={() => changeLanguage(item.code)}
                                >
                                    <CustomText variant="body" style={{ color: i18nInstance.language === item.code ? colors.primary : colors.text }}>
                                        {item.label}
                                    </CustomText>
                                    {i18nInstance.language === item.code && (
                                        <Ionicons name="checkmark" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        bottom: 22,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        marginBottom: 12,
        marginLeft: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    label: {
        flex: 1,
        fontWeight: '600',
    },
    footer: {
        paddingBottom: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    }
});
