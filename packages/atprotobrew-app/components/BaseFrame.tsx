// BaseFrame.tsx
import type React from "react";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface BaseFrameProps {
	children?: React.ReactNode;
	width: number; // 必須 props に変更
	height: number; // 必須 props に変更
	baseWidth?: number;
	baseHeight?: number;
}

export const BaseFrame: React.FC<BaseFrameProps> = ({ children, width, height, baseWidth = 393, baseHeight = 852 }) => {
	const scale = useSharedValue(1.15);
	const opacity = useSharedValue(0);

	useEffect(() => {
		scale.value = withSpring(1, {
			damping: 14,
			stiffness: 90,
			mass: 0.8,
		});

		opacity.value = withTiming(1, {
			duration: 600,
			easing: Easing.out(Easing.quad),
		});
	}, [opacity, scale]); // サイズ変更時にも追従

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
			opacity: opacity.value,
		};
	});

	// 渡された width と height を使って動的にパスを生成
	const framePath = `
    M 0 0 
    H ${width} 
    V ${height} 
    H 0 
    Z 
    M 20 20 
    H ${width - 20} 
    V ${height - 100} 
    C ${width / 2 + 50} ${height - 100}, ${width / 2 + 40} ${height - 125}, ${width / 2} ${height - 125}
    C ${width / 2 - 40} ${height - 125}, ${width / 2 - 50} ${height - 100}, 20 ${height - 100}
    Z
  `;

	return (
		<View style={[styles.container, { width, height }]}>
			{/* 1. 内側のメインコンテンツエリア */}
			<View style={styles.contentContainer}>{children}</View>

			{/* 2. アニメーションフレーム */}
			<AnimatedSvg
				width={width}
				height={height}
				viewBox={`0 0 ${baseWidth} ${baseHeight}`}
				style={[StyleSheet.absoluteFill, animatedStyle]}
				pointerEvents="box-none"
			>
				<Path d={framePath} fill="#FFF" />
			</AnimatedSvg>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#0A192F", // アルファ（alf）の背景色があればそちらに差し替えてもOKです
	},
	contentContainer: {
		flex: 1,
		paddingTop: 30,
		paddingHorizontal: 30,
		paddingBottom: 130, // 下部の凹みとボタンを避けるスペース
		overflow: "hidden",
	},
});
