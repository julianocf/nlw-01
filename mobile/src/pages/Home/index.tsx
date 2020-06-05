import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {
    const navigation = useNavigation();

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity,
        })
    }
    
    function handleSelectUf(uf: string) {
        setSelectedUf(uf);
    }

    function handleSelectCity(city: string) {
        setSelectedCity(city);
    }
    
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === '0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
        });
    }, [selectedUf]);

    return (<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>    
                <ImageBackground 
                    source={require('../../assets/home-background.png')} 
                    style={styles.container}
                    imageStyle={{ width: 274, height: 368 }}
                >
                    <View style={styles.main}>
                        <Image source={require('../../assets/logo.png')} />
                        <View>
                            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            onValueChange={(value) => handleSelectUf(value)}
                            value={selectedUf}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{
                                            label: 'Selecione uma UF',
                                            value: '0',
                                        }}
                            items={ufs.map(uf => ({ label: uf, value: uf }))}
                            Icon={() => {
                                return <Icon name="chevron-down" size={24} style={styles.selectCaret} />;
                            }}
                        />
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            onValueChange={(value) => handleSelectCity(value)}
                            value={selectedCity}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{
                                            label: 'Selecione uma Cidade',
                                            value: '0',
                                        }}
                            items={cities.map(city => ({ label: city, value: city }))}
                            Icon={() => {
                                return <Icon name="chevron-down" size={24} style={styles.selectCaret} />;
                            }}
                        />
                        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                            <View style={styles.buttonIcon}>
                                <Text>
                                    <Icon name="arrow-right" color="#FFF" size={24} />
                                </Text>
                            </View>
                            <Text style={styles.buttonText}>
                                Entrar
                            </Text>
                        </RectButton>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>);
}

export default Home;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    selectCaret: {
        color: '#c0c0c0',
        paddingTop: 18, 
        paddingRight: 10
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
});  

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginBottom: 5,
        height: 60,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        paddingLeft: 20,
        borderWidth: 0.5,
        borderColor: '#FFF',
        backgroundColor: '#FFF',
        borderRadius: 8,
        color: '#c0c0c0',
        paddingRight: 30,// to ensure the text is never behind the icon
    },
    inputAndroid: {
        marginBottom: 5,
        height: 60,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        paddingLeft: 20,
        borderWidth: 0.5,
        borderColor: '#FFF',
        backgroundColor: '#FFF',
        borderRadius: 8,
        color: '#c0c0c0',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});