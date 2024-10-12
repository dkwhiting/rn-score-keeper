import {
	View,
	Text,
	TextInput,
	ScrollView,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import React, {
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Switch } from 'react-native-elements';
import { addGame } from '../store/gameSlice';
import PlayerSelectTile from './PlayerSelectTile';
import { colorCalc, colors, icons, playerIcons } from '../data';
import { useAddNewGameMutation } from '../store/apiSlice';
import { useKeyboard } from '../hooks/useKeyboard';
import LoadingModal from './LoadingModal';
import { Animated } from 'react-native';
import { UserContext } from './Main';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const NewGame = ({ showNewGame, setShowNewGame, navigation }) => {
	const keyboardHeight = useKeyboard();
	const windowHeight = Dimensions.get('window').height;
	const [contentBottom, setContentBottom] = useState(0);
	const user = useContext(UserContext);
	const [name, setName] = useState('');
	const [scores, setScores] = useState(		{ 
			round_1: {
				player_1: 0
			}
		},);
	const [players, setPlayers] = useState(
		{ 
			player_1: {
				name: user.displayName,
				color: colors[0],
				icon: { name: 'ghost', type: 'material-community' },
			}
		},
	);
	const [newPlayerName, setNewPlayerName] = useState('');
	const [highestWins, setHighestWins] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [
		addGame,
		{ isLoading: isUpdating, isError, error },
	] = useAddNewGameMutation();
	const handleSubmit = async () => {
		if (!name) {
			setErrorMessage('Name cannot be left blank');
		} else if (Object.keys(players).length < 1) {
			setErrorMessage('You must add at least one player');
		} else {
			const date = new Date();
			const gameId = Date.now().toString();
			const body = {
				ownerId: user.uid,
				name,
				players,
				scores,
				highestWins,
				created: date.toISOString().slice(0, 10).replace(/-/g, ''),
				completed: false,
			};
			console.log(body)
			// Perform the mutation to add the game
			const newGame = await addGame({
				ownerId: user.uid,
				gameId: gameId,
				body,
			}).unwrap(); // Unwrap the result to handle errors automatically
	
			// Handle success and navigate if newGame is defined
			if (newGame?.data) {
				console.log('this is the new Game', newGame);
				navigation.pop();
				navigation.navigate('LiveGame', { game: newGame.data });
			}
		}
	};
	
	// Optionally, you can handle displaying the error elsewhere in the UI
	useEffect(() => {
		if (isError) {
			console.error('Error:', error); // Log the error for debugging
			setErrorMessage('Failed to create the game. Please try again.');
		}
	}, [isError, error]);

	const handleAddPlayer = () => {
		if (newPlayerName.length > 0) {
			const playerKey = `player_${Object.keys(players).length + 1}`;
			const newPlayerData = {
				name: newPlayerName,
				color: colors[colorCalc(Object.keys(players).length)],
				icon: icons[Math.floor(Math.random() * icons.length)],
			};
			setPlayers((prevPlayers) => ({
				...prevPlayers,
				[playerKey]: newPlayerData,
			}));
			setScores((prevScores) => ({
				...prevScores,
				[`round_1`]: {
					...prevScores[`round_1`],
					[playerKey]: 0,
				},
			}));
			setNewPlayerName('');
		}
		console.log(players)
	};

	return (
		<>
			{isUpdating ? <LoadingModal /> : null}
			<View style={{ flex: 1 }}>
				<TextInput
					style={{
						width: '100%',
						fontSize: 30,
						padding: 10,
						alignSelf: 'center',
						backgroundColor: 'white',
						borderRadius: 20,
					}}
					value={name}
					type="string"
					placeholder={!errorMessage.length ? 'Enter a name for your game' : errorMessage.length}
					placeholderTextColor={!errorMessage.length ? '#BABABA' : 'red'}
					onChangeText={setName}
					onFocus={() => setErrorMessage('')}
					inputGoal="text"
					// autoFocus
				/>
				<View style={{ flex: 1, paddingTop: 15 }}>
					<ScrollView
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 5,
							padding: 5,
							flex: 0,
							flex: 1,
						}}
					>
						<Text
							style={{
								fontSize: 22,
								padding: 5,
								paddingBottom: 15,
							}}
						>
							Players
						</Text>
						{Object.entries(players).length > 0 && Object.entries(players).map(([key, player], index) => {
							console.log(player);
							return (
								<PlayerSelectTile
									player={player}
									key={key}
									players={players}
									setPlayers={setPlayers}
									index={index}
								/>
							);
						})}
						<TextInput
							style={{
								fontSize: 18,
								padding: 13,
								backgroundColor: 'white',
								borderRadius: 10,
							}}
							value={newPlayerName}
							type="string"
							placeholder="Player name"
							onChangeText={setNewPlayerName}
							inputGoal="text"
							autoComplete="off"
							autoCorrect={false}
							enablesReturnKeyAutomatically={true}
							onSubmitEditing={() => handleAddPlayer()}
							blurOnSubmit={false}
						/>
					</ScrollView>
				</View>
				<View style={{ display: 'flex', flexDirection: 'column', padding: 5 }}>
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<Text style={{ fontSize: 16, padding: 5 }}>Highest score wins</Text>
						<Switch
							trackColor={{ false: '#BCBCBC', true: '#06d6a0 ' }}
							thumbColor={'#FFFFFF'}
							ios_backgroundColor="#DDDDDD"
							onValueChange={setHighestWins}
							value={highestWins}
						/>
					</View>
				</View>
				<Button
					title="Start Game"
					color="white"
					onPress={() => handleSubmit()}
					style={{
						width: '80%',
						alignSelf: 'center',
						borderRadius: 5,
						paddingBottom: 30,
					}}
				/>
			</View>
		</>
	);
};

export default NewGame;
