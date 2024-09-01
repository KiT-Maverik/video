import {SxProps, Theme} from "@mui/material";

export const main: SxProps<Theme> = {
    flexGrow: 1,
}

export const drawer: { container: SxProps<Theme>; item: { container: SxProps<Theme>; cover: SxProps<Theme> } } = {
    container: {
        width: 300,
    },
    item: {
 container: {
    display: "flex",
        gap: 2,
     alignItems: "center",
        p: theme => theme.spacing(1, 2),
 },
        cover: {
     height: 48,
            aspectRatio: 1/3
        }
}
}

export const skeleton: { cover: SxProps<Theme>; label: SxProps<Theme> } = {
    cover: {
        ...drawer.item.cover
    },
    label: {
        width: 100,
    }
}

export default { drawer, main, skeleton }