import React, { useState } from 'react';
import styled from 'styled-components';
import { View, TextInput, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
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
    border-bottom-color: #ccc;
    background-color: ${props => props.theme.backgroundColor};
    z-index: 1000; 
`;

const Input = styled(TextInput)`
    flex: 1;
    margin-right: 20px;
    text-align: right;
    font-size: 18px;
    height: 40px;
`;

const NavBar = ({ handleSearch }) => {
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (text) => {
        setSearchText(text);
    };

    const handleSearchSubmit = () => {
        handleSearch(searchText);
        Keyboard.dismiss();
    };

    return (
        <Container>
            <TouchableOpacity onPress={() => navigate('/ff')}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Input
                value={searchText}
                onChangeText={handleInputChange}
                placeholder="Search..."
                onSubmitEditing={handleSearchSubmit}
                placeholderTextColor={'#ccc'}     
            />
            <TouchableOpacity onPress={handleSearchSubmit}>
                <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
        </Container>
    );
};

export default NavBar;
