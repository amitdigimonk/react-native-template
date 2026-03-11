import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({

    // Fills the whole screen, great for main screen wrappers
    screenContainer: {
        flex: 1,
    },
    // Perfect for perfectly centering items
    centerAlign: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Quick horizontal layouts (like headers or lists of buttons)
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // Reusable drop shadow for cards or images
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Required for Android shadows
    },

    title: {
        fontFamily: 'NeoSans', // Just call it by name!
        fontSize: 24,
        color: '#111827',
    },

});