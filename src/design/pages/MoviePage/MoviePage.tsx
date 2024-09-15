import DeleteIcon from '@mui/icons-material/DeleteRounded';
import CancelIcon from '@mui/icons-material/CloseRounded';
import ConfirmIcon from '@mui/icons-material/CheckRounded';
import {
    Box,
    Button,
    IconButton,
    Rating,
    Skeleton,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import React, {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import {useDeleteMovieMutation, useGetMovieByIdQuery} from "api";
import {Movie} from "api/contracts/movie/entities/entities";
import {Page, Modal} from "design/templates";

import style from './MoviePage.styles'
import {route, useToast} from "App";

export function MoviePage() {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const { movieId } = useParams();
    const { showToast } = useToast();
    const { transitions } = useTheme();
    const navigate = useNavigate();

    const { deleteMovieMutation } = useDeleteMovieMutation();
    const {getMovieByIdQuery} = useGetMovieByIdQuery(parseInt(movieId || ""))

    useEffect(() => {
        getMovieByIdQuery.refetch()
    }, [movieId]);

    const handleMovieDelete = useCallback(() => {
        deleteMovieMutation.mutateAsync(
            parseInt(movieId || ""),
            {
                onSuccess: () => {
                    showToast({type: 'info', message: 'Movie deleted'})
                    navigate(route.home)
                }
            }
        )
    }, []);

    const {cover, cast, year, title, director, genre, rating, plotSummary} = useMemo<{ [key in keyof Omit<Movie, 'id' | 'thumb'>]: ReactNode }>(() => {
        if (getMovieByIdQuery.isLoading || !getMovieByIdQuery.data?.data) return {
            cover: <Skeleton sx={style.skeleton.cover}/>,
            cast: [1,2,3].map(item => <Skeleton key={item} sx={style.skeleton.cast}/>),
            year: <Skeleton sx={style.skeleton.year}/>,
            title: <Skeleton sx={style.skeleton.title}/>,
            director: <Skeleton sx={style.skeleton.director}/>,
            genre: <Skeleton sx={style.skeleton.genre}/>,
            rating: <Rating value={0} disabled />,
            plotSummary: <Box>
                {[1, 2, 3, 4].map((item) => <Skeleton key={item}/>)}
            </Box>,
        }
        else {
            const {cover, cast, year, title, director, genre, rating, plotSummary} = getMovieByIdQuery.data.data

            return {
                cover: <Box component='img' src={cover} sx={style.cover.image}/>,
                cast: <Typography component='span'>{cast.join(', ')}</Typography>,
                year: `Year: ${year}`,
                title: <Typography variant='h3'>{title}</Typography>,
                director: `Director: ${director}`,
                genre: `Genre: ${genre}`,
                rating: <Rating value={rating} readOnly/>,
                plotSummary: <Typography>{plotSummary}</Typography>,
            }
        }
    }, [getMovieByIdQuery]);

    return (
        <Page containerStyle={style.container}>
            <Box sx={style.cover.container}>
                {cover}
            </Box>
            <Box sx={style.info}>
                <Stack>
                    <Box sx={style.header.container}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
                            <TextField
                                variant='standard'
                                value='oewiowp'
                                sx={style.header.title} onFocus={() => setEditMode(true)} onBlur={() => setEditMode(false)}
                            />
                            <Box sx={{
                                ...style.header.editControls.idle,
                                ...{
                                    transition: ({transitions}) => transitions.create('margin', {
                                        easing: transitions.easing.sharp,
                                        duration: transitions.duration.leavingScreen,
                                    }),
                                    ...editMode? { ml: 0 }: {ml: -30}
                                }}}>
                                <IconButton>
                                    <CancelIcon/>
                                </IconButton>
                                <IconButton onClick={() => 333}>
                                    <ConfirmIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                        <IconButton onClick={() => setShowDeleteModal(true)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Box>
                    <Stack direction='row' gap={2}>
                        <Typography variant='caption' color="text.secondary">{director}</Typography>
                        <Typography variant='caption' color="text.secondary">{genre}</Typography>
                        <Typography variant='caption' color="text.secondary">{year}</Typography>
                    </Stack>
                </Stack>
                {rating}
                <Typography fontWeight='bold'>{`Cast: `}
                    {cast}
                </Typography>
                {plotSummary}
            </Box>
            <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <Modal.Header title="Are you sure you want to delete this movie?" onClose={() => setShowDeleteModal(false)}/>
                <Modal.Body>
                    <Typography>You can not undo this action</Typography>
                </Modal.Body>
                <Modal.Actions>
                    <Button variant='text' onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant='contained' color="error" onClick={handleMovieDelete}>Delete</Button>
                </Modal.Actions>
            </Modal>
        </Page>
    );
}
