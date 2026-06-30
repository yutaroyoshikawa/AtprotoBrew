import { atoms as a } from "@atprotobrew/common/alf";
import { addressOf, slotOf } from "@atprotobrew/common/launcher/launcherAddress";
import type { GridConfig } from "@atprotobrew/common/launcher/launcherGrid";
import type { LauncherItem } from "@atprotobrew/common/launcher/types";
import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { measure, useAnimatedRef } from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";
import { Slot } from "./Slot";

interface LauncherPageProps {
	page: number;
	items: LauncherItem[];
	isEdit: boolean;
	gridConfig: GridConfig;
	screenWidth: number;
	isDragging: SharedValue<boolean>;
	draggingId: SharedValue<string>;
	hoverAddress: SharedValue<number>;
	dragX: SharedValue<number>;
	dragY: SharedValue<number>;
	gridOriginX: SharedValue<number>;
	gridOriginY: SharedValue<number>;
	edgeEnterAt: SharedValue<number>;
	currentPage: SharedValue<number>;
	onDragEnd: (id: string, targetAddress: number) => void;
	onEnterEdit: () => void;
	onFlipPage: (delta: number) => void;
	onSetOverlayChannel: (channel: { channelName: string; thumbnail: string } | null) => void;
	onOpenApp: (item: LauncherItem) => void;
}

export const LauncherPage = React.memo(function LauncherPage({
	page,
	items,
	isEdit,
	gridConfig,
	screenWidth,
	isDragging,
	draggingId,
	hoverAddress,
	dragX,
	dragY,
	gridOriginX,
	gridOriginY,
	edgeEnterAt,
	currentPage,
	onDragEnd,
	onEnterEdit,
	onFlipPage,
	onSetOverlayChannel,
	onOpenApp,
}: LauncherPageProps) {
	const { cols, rows, perPage } = gridConfig;

	// C4: Only page 0 measures grid origin (all pages share same screen position)
	const gridRef = useAnimatedRef<View>();

	const doMeasure = useCallback(() => {
		if (page !== 0) {
			return;
		}

		scheduleOnUI(() => {
			"worklet";

			const measured = measure(gridRef);

			if (measured) {
				gridOriginX.value = measured.pageX;
				gridOriginY.value = measured.pageY;
			}
		});
	}, [page, gridRef, gridOriginX, gridOriginY]);

	const slotMap = useMemo(() => {
		const map = new Map<number, LauncherItem>();

		for (const item of items) {
			if (Math.floor(item.address / perPage) === page) {
				map.set(slotOf(item.address, perPage), item);
			}
		}

		return map;
	}, [items, page, perPage]);

	const addresses = useMemo(
		() =>
			Array.from({ length: rows }, (_, row) =>
				Array.from({ length: cols }, (_, col) => addressOf(page, row * cols + col, perPage)),
			),
		[page, cols, rows, perPage],
	);

	const sharedProps = {
		isEdit,
		gridConfig,
		screenWidth,
		isDragging,
		draggingId,
		hoverAddress,
		dragX,
		dragY,
		gridOriginX,
		gridOriginY,
		edgeEnterAt,
		currentPage,
		onDragEnd,
		onEnterEdit,
		onFlipPage,
		onSetOverlayChannel,
		onOpenApp,
	};

	return (
		<View style={[a.flex_1, a.items_center, a.justify_center]}>
			<View ref={gridRef} onLayout={doMeasure}>
				{addresses.map((rowAddresses, rowIndex) => (
					<View key={rowIndex} style={[a.flex_row]}>
						{rowAddresses.map((address) => (
							<Slot
								key={address}
								address={address}
								item={slotMap.get(slotOf(address, perPage))}
								{...sharedProps}
							/>
						))}
					</View>
				))}
			</View>
		</View>
	);
});
