const lightTheme = {
    primaryColor: '#000000',
    secondaryColor: '#0085ff',
    tertiaryColor: '#2e4052',

    backgroundColor: '#ffffff',
};
const dark_dim_theme = {
    primaryColor: '#ffffff', 
    secondaryColor: '#0085ff',
    tertiaryColor: '#2e4052',

    backgroundColor: '#161e27',
};

const dark_black_theme = {
    primaryColor: '#ffffff',
    secondaryColor: '#0085ff',
    tertiaryColor: '#2e4052',

    backgroundColor: '#000000',
};

const darkTheme = {
    dim: dark_dim_theme,
    dark: dark_black_theme,
};

const themes = {
    light: lightTheme,
    dark: darkTheme,
};

export default themes;