import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TeamList from './TeamList';
import AthleteList from "./AthleteList";
import TeamEdit from "./TeamEdit";
import AthleteEdit from "./AthleteEdit";
import AthleteView from "./AthleteView";
import TestList from "./TestList";
import TeamView from "./TeamView"

class App extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path='/'  element={<Home/>}/>
                    <Route path='/teams'  element={<TeamList/>}/>
                    <Route path='/athletes' element={<AthleteList/>}/>
                    <Route path='/athletes/view-athlete/:id' element={<AthleteView/>}/>
                    <Route path='/athletes/:id/tests'  element={<TestList/>} />
                    <Route path='/athletes/:id' element={<AthleteEdit/>}/>
                    <Route path='/teams/:id' element={<TeamEdit/>}/>
                    <Route path='/teams/view-team/:id' element={<TeamView/>}/>
                </Routes>
            </Router>
        );
    }
}

export default App;


