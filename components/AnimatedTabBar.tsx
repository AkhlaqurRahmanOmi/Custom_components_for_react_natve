import { Feather } from '@expo/vector-icons';
import { View, Text, TouchableOpacity ,StyleSheet, LayoutChangeEvent, Dimensions} from 'react-native';
import TabBarButton from './TabBarButton';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function TabBar({ state, descriptors, navigation }) {
    const [dimension, setDimension] = useState({ height: 20, width: 100 })
    const buttonWidth = dimension.width / state.routes.lenght;
    const onTabBarLayout = (e: LayoutChangeEvent) => {
        setDimension({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width
        })
    }
    const tabPositionX = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(()=>{
        return {
            transform : [{translateX: tabPositionX.value}]
        }
    })
    return (
        <View style={styles.tabbar}>
            <Animated.View style={{
                position: 'absolute',
                backgroundColor: '#68e86b',
                borderRadius: 30,
                marginHorizontal:12,
                height: dimension.height -15,
                width: buttonWidth - 25
            }}/>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    tabPositionX.value = withSpring(buttonWidth * index, {duration:1500})
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                return (
                    <TabBarButton
                    key={route.name}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    isFocused={isFocused}
                    routeName={route.name}
                    color={isFocused?"#673ab7" : "#222"}
                    label={label}
                    />
                    // <TouchableOpacity
                    // key={route.name}
                    //     accessibilityRole="button"
                    //     accessibilityState={isFocused ? { selected: true } : {}}
                    //     accessibilityLabel={options.tabBarAccessibilityLabel}
                    //     testID={options.tabBarTestID}
                    //     onPress={onPress}
                    //     onLongPress={onLongPress}
                    //     style={styles.tabBarItem}
                    // >
                    //     {icon[route.name]({color:isFocused?"#673ab7": "#222"})}
                    //     <Text style={{ color: isFocused ? 'red' : '#222' }}>
                    //         {label}
                    //     </Text>
                    // </TouchableOpacity>
                );
            })}
        </View>
    );
}
const styles = StyleSheet.create({
    tabbar:{
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'grey',
        marginHorizontal: 50,
        paddingVertical:15,
        borderRadius:35,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 15},
        shadowRadius: 10,
        shadowOpacity: 0.5,
    },
    
})