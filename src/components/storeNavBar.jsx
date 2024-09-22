import React, { useState, useRef, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { View, TextInput, TouchableOpacity, Dimensions, Keyboard, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigate } from 'react-router-native';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${height * 0.12}px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding-top: ${height * 0.05}px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: transparent;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.theme.tertiaryColor};
    background-color: ${props => props.theme.backgroundColor};
    z-index: 1000; 
`;

const Input = styled(TextInput)`
    flex: 1;
    margin-right: 20px;
    color: ${props => props.theme.primaryColor};
    text-align: right;
    font-size: 18px;
    height: 40px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.inFocus ? props.theme.tertiaryColor : 'transparent'};
`;

const ClearButton = styled.TouchableOpacity`
    margin-left: 20px;
`;

const NavBar = ({ handleSearch }) => {
    const theme = useTheme();
    const [searchText, setSearchText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        const backAction = () => {
            if(inputRef.current.isFocused()) {
                handleBlur();
                inputRef.current.blur();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const handleInputChange = (text) => {
        setSearchText(text);
    };

    const handleSearchSubmit = () => {
        handleSearch(searchText);
        Keyboard.dismiss();
        inputRef.current.blur(); 
    };

    const handleClearSearch = () => {
        setSearchText('');
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <Container>
            <TouchableOpacity onPress={() => navigate('/ff')}>
                <Ionicons name="arrow-back" size={24} color={theme.primaryColor} />
            </TouchableOpacity>
            {isFocused && (
                <ClearButton onPress={handleClearSearch}>
                    <Ionicons name="close" size={24} color='red' />
                </ClearButton>
            )}
            <Input
                ref={inputRef}
                value={searchText}
                onChangeText={handleInputChange}
                placeholder={isFocused ? '' : 'Search...'}
                onSubmitEditing={handleSearchSubmit}
                placeholderTextColor={theme.tertiaryColor}
                onFocus={handleFocus}
                onBlur={handleBlur}
                inFocus={isFocused}
            />
            <TouchableOpacity onPress={handleSearchSubmit}>
                <Ionicons name="search" size={24} color={theme.primaryColor} />
            </TouchableOpacity>
        </Container>
    );
};

export default NavBar;
