import { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import Festival  from '../../interfaces/Festival';
import LinearProgress from '@mui/material/LinearProgress';
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Checkbox, FormControlLabel } from '@mui/material';

import {
    Box,
    Button,
    TextField,
    Paper,
    Stack,
    Typography,
  } from '@mui/material';


export default function ImportCSV() {


    const [file, setFile] = useState<File>();
    const [progress, setProgress] = useState<number>(0);
    const [nbErrors, setNbErrors] = useState<number>(0);
    const [festival, setFestival] = useState<Festival | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [replaceExisting, setReplaceExisting] = useState<boolean>(false);
    const [selectedGamesToReplace, setSelectedGamesToReplace] = useState<any[]>([]);
    const [selectedGamesToKeep, setSelectedGamesToKeep] = useState<any[]>([]);

    const handleDialogOpen = () => {
        setOpenDialog(true);
      };
      
    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    
    const handleCheckboxChange = (selectedGame: any, checked: boolean) => {
        if (checked) {
            // On ajoute le jeu dans le tableau selectedGamesToKeep
            setSelectedGamesToKeep((prevSelected) => [...prevSelected, selectedGame]);
        } else {
            // On enlève le jeu du tableau selectedGamesToKeep
            setSelectedGamesToKeep((prevSelected) => {
                const index = prevSelected.findIndex((prevSelectedGame) => prevSelectedGame.id === selectedGame.id);
                if (index === -1) {
                    return prevSelected;
                }
                return [...prevSelected.slice(0, index), ...prevSelected.slice(index + 1)];
            }
            );
        }

        // Update the checked state directly in the selectedGamesToReplace array
        setSelectedGamesToReplace((prevSelected) =>
            prevSelected.map((prevSelectedGame) =>
                prevSelectedGame.id === selectedGame.id ? { ...prevSelectedGame, checked } : prevSelectedGame
            )
        );
    };
    
    const handleReplaceExisting = async () => {
    setOpenDialog(false);
    
    for (const gameToReplace of selectedGamesToReplace) {
        try {
        await updateJeu(gameToReplace);
        } catch (error) {
        // Gérer les erreurs si nécessaire
        }
    }
    
    // Réexécutez le traitement CSV ici
    };
      
    
    // Fetch festival data
    useEffect(() => {
    const fetchData = async () => {
        try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/festival/next`);
        const festival: Festival = res.data;
        setFestival(festival);

        
        //console.log("Festival édition " + festival.edition);
        } catch (error) {
        console.error(error);
        }
    };
    fetchData();
    }, []);

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    }

    // Fonction qui modifie un jeu existant (écrase les données actuelles par celles du CSV)
    const updateJeu = async (row:any) => {  
            try{
                // On essaie de créer le jeu avec les données dans les colonnes : idJeu, Nom du jeu, Auteur, Editeur, nb joueurs, âge min, Durée, Type, Notice
                const response = await axios.put(`${import.meta.env.VITE_API_URL}/jeu`, {
                    // Converti l'id en int
                    id: parseInt(row["idJeu"]),
                    nom: row["Nom du jeu"],
                    auteur: row["Auteur"],
                    editeur: row["Éditeur"],
                    nombreJoueurs: row["nb joueurs"],
                    // Converti l'âge min et la durée en int
                    ageMin: parseInt(row["Âge min"]),
                    duree: parseInt(row["Durée"]),
                    type: row["Type"],
                    notice: row["Notice"],
                    // Converti recu et aAnimer en booléen, si la valeur est "oui" alors c'est true, sinon c'est false
                    recu: row["Reçu"] === "oui",
                    aAnimer: row["À animer"] === "oui",
                });
    
                return response.data.jeu;
            }catch (error:any) {
                setNbErrors(nbErrors + 1);
                throw error; // Rejetez l'erreur pour que la promesse soit rejetée
            }
        }

    // Fonction qui renvoie une promesse pour créer un jeu
    const createJeu = async (row:any) => {

        try{
            // On essaie de créer le jeu avec les données dans les colonnes : idJeu, Nom du jeu, Auteur, Editeur, nb joueurs, âge min, Durée, Type, Notice
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/jeu`, {
                // Converti l'id en int
                id: parseInt(row["idJeu"]),
                nom: row["Nom du jeu"],
                auteur: row["Auteur"],
                editeur: row["Éditeur"],
                nombreJoueurs: row["nb joueurs"],
                // Converti l'âge min et la durée en int
                ageMin: parseInt(row["Âge min"]),
                duree: parseInt(row["Durée"]),
                type: row["Type"],
                notice: row["Notice"],
                // Converti recu et aAnimer en booléen, si la valeur est "oui" alors c'est true, sinon c'est false
                recu: row["Reçu"] === "oui",
                aAnimer: row["À animer"] === "oui",
            });

            return response.data.jeu;
        }catch (error:any) {
            // Si le jeu existe déjà, on l'ajoute dans le tableau des jeux déjà existants
            //console.log("Ajout du jeu dans les jeux déjà existants");
            //console.log(error.response.data.jeu);
            setSelectedGamesToReplace((prevSelected) => [...prevSelected, row]);  
            setNbErrors(nbErrors + 1);
            throw error; // Rejetez l'erreur pour que la promesse soit rejetée
        }
    };

    const createEspaceJeu = async (row: any) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/espaceJeu`, {
                // Converti l'id en int
                nom: row["Zone plan"],
                festivalID: festival!.id,
            });
    
            //console.log(response.data.message);
            return response.data.espaceDeJeu;
        } catch (error:any) {
            // L'espace de jeu existe déjà, on le renvoie quand même
            return error.response.data.espaceDeJeu;
        }
    };
    

    const createSousEspaceJeu = async (row:any, espaceJeuId:number) => {

        try{
            // On essaie de créer le sous espace de jeu avec les données dans les colonnes : Zone bénévole
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/sousEspaceJeu`, {
                // Converti l'id en int
                id: parseInt(row["idZone"]),
                // Si Zone bénévole est vide, on créé un sous espace de jeu avec le même nom que l'espace de jeu
                nom: row["Zone bénévole"] === "" ? row["Zone plan"] : row["Zone bénévole"],
                nombreBenevoles: 2,
                espaceDeJeuID:  espaceJeuId,
            });

            //console.log(response.data.message);
            return response.data.sousEspaceDeJeu;
        }catch(error:any) {
            return error.response.data.sousEspaceDeJeu;
        }
    }

    const handleFileUpload = () => {
        if (file) {
            // Utilisez FileReader pour lire le contenu du fichier
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            //console.log(file);

            reader.onload = () => {

                if (reader.result === null) {
                    alert("Erreur : le fichier csv n'a pas le bon format");
                    return;
                }
                const csvData = reader.result?.toString();
                
                ////console.log(csvData);

                // Utilisez papaparse pour traiter le CSV
                Papa.parse(csvData, {
                    header: true, // Indique qu'il y a un en-tête dans le CSV
                    complete: async (result) => {
                    // result.data contient les données du CSV
                    //console.log(result.data);
                    
                    let index = 0;
                    // Parcours chaque ligne du CSV
                    for (const row of result.data ) {
                        
                        try{
                            // On essaie de créer le jeu avec les données dans les colonnes : idJeu, Nom du jeu, Auteur, Editeur, nb joueurs, âge min, Durée, Type, Notice
                            const jeu = await createJeu(row);
                            // On essaie de créer l'espace de jeu avec les données dans les colonnes : Zone plan
                            const espaceJeu = await createEspaceJeu(row);
                            // On essaie de créer le sous espace de jeu avec les données dans les colonnes : Zone bénévole
                            const sousEspaceJeu = await createSousEspaceJeu(row, espaceJeu.id);

                            //console.log("Id du jeu : " + jeu.id);
                            //console.log("Id du festival : " + festival!.id);
                            //console.log("Id du sous espace de jeu : " + sousEspaceJeu.id);
                            // On créé la relation entre le jeu, le sous espace de jeu et le festival
                            axios.post(`${import.meta.env.VITE_API_URL}/jeuSousEspaceFestival`, {
                                jeuID: jeu.id,
                                festivalID: festival!.id,
                                sousEspaceDeJeuID: sousEspaceJeu.id,
                            }).then((response) => {
                                //console.log(response.data.message);
                            }).catch((error) => {
                                alert(error.response.data.error);
                            });
                            

                        }catch (error:any) {
                            // Si une erreur est survenue, on l'affiche et on incrémente le nombre d'erreurs
                            //alert(error.response.data.error);
                        }

                        // Mettez à jour la barre de progression à chaque itération
                        const progressPercentage = ((index + 1) / result.data.length ) * 100;
                        setProgress(progressPercentage);
                        index++;                
                    }
                    //console.log("Import terminé avec " + nbErrors + " erreurs");
                    //console.log("Import terminé avec " + selectedGamesToReplace.length + " jeux déjà existants");
                    handleDialogOpen(); // Ajoutez cette ligne pour ouvrir la boîte de dialogue
                    },
                });
            };

            
        }
    }
      

    return (
        <Box>
            <Typography variant="h4">Import des jeux</Typography>
            <Typography variant="body1">Importez un fichier CSV pour ajouter tous les jeux et les zones de jeux correspondantes</Typography>
            <Stack spacing={2} direction="row">
                <TextField 
                type="file" 
                variant="outlined" 
                onChange={handleFileChange} />
                <Button variant="contained" color="primary" onClick={handleFileUpload} >Importer</Button>
            </Stack>
            {progress > 0 && <LinearProgress variant="determinate" value={progress} />}
            { openDialog && (
                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Jeux déjà existants</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Certains jeux existent déjà dans la base de données. Veuillez sélectionner ceux que vous souhaitez écraser :
                        </DialogContentText>
                        <Stack spacing={2}>
                            {selectedGamesToReplace.map((game) => (
                            <FormControlLabel
                                key={game.id}
                                control={
                                // Si check box est cochée on ajoute le jeu dans le tableau selectedGamesToKeep
                                // Sinon on l'enlève
                                <Checkbox
                                    onChange={(e) => handleCheckboxChange(game, e.target.checked)}
                                />
                                }
                                label={game["Nom du jeu"]}
                            />
                            ))}
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                        Annuler
                        </Button>
                        <Button onClick={handleReplaceExisting} color="primary">
                        Écraser les jeux sélectionnés
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            

        </Box>
    );
}