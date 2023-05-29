import { Routes, Route } from 'react-router';

import Pokedex from './pages/Pokedex';
import DailyPokemon from './pages/DailyPokemon';
import Companions from './pages/Companions';

import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Pokedex />} />
				<Route path="/daily-pokemon" element={<DailyPokemon />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
                <Route path="/companions" element={<Companions />} />
			</Routes>
		</div>
	);
}

export default App;
