import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import Constants from '../config/Constants';

import Rook from './Rook';
import Bishop from './Bishop';
import Knight from './Knight';
import Queen from './Queen';
import King from './King';
import Pawn from './Pawn';

const Figures = {
    Rook,
    Bishop,
    Knight,
    Queen,
    King,
    Pawn,
};

class App extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeElement: null,
            queue: 'white',
            elementPoints: {},
            elementCurrentPositions: {},
            ChessPositionsDataState: {},
            isMenuOpen: false,
        };
    }

    componentDidMount() {
        const axiosInstance = axios.create({
            baseURL: Constants.baseURL,
        });
        const returnObj = localStorage.getItem('ChessPositionsDataState');
        if (returnObj) {
            console.log('locastorage');
            const chess = JSON.parse(returnObj);
            this.setState({ ChessPositionsDataState: chess });
            this.positionsTimeout = setTimeout(() => {
                this.ChessPositions();
                this.positionsToState();
            });
        } else {
            console.log('from file');
            axiosInstance.get('/chess')
                .then((res) => {
                    const chess = JSON.parse(res.data);
                    this.setState({ ChessPositionsDataState: chess });
                    this.ChessPositions();
                    this.positionsToState();
                });
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.ChessPositions);
        }
    }

    ChessPositions = () => {
        const rowsPositionsLiterals = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const elementPoints = {};
        const deskTableWidth = this.deskTable.offsetWidth;
        for (let i = 0; i < rowsPositionsLiterals.length; i += 1) {
            for (let j = 0; j < rowsPositionsLiterals.length; j += 1) {
                elementPoints[rowsPositionsLiterals[i] + (rowsPositionsLiterals.length - j)] = { top: `${deskTableWidth / 8 * j}px`, left: `${deskTableWidth / 8 * i}px` };
            }
        }
        this.setState({ elementPoints });
    }

    saveCurrentPositions = () => {
        const { ChessPositionsDataState, elementCurrentPositions, isMenuOpen } = this.state;
        for (let i = 0; i < Object.keys(elementCurrentPositions).length; i += 1) {
            for (let j = 0; j < Object.keys(elementCurrentPositions).length; j += 1) {
                if ((j + 1) === ChessPositionsDataState[i].id
                    && elementCurrentPositions[j][j + 1]
                    !== ChessPositionsDataState[i].position
                ) {
                    ChessPositionsDataState[i].position = elementCurrentPositions[j][j + 1];
                }
            }
        }
        const axiosInstance = axios.create({
            baseURL: Constants.baseURL,
        });
        axiosInstance.post('/chess-save', {
            ChessPositionsDataState,
        })
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ isMenuOpen: !isMenuOpen });
                }
            });
    }

    loadSavedPositions = () => {
        const { isMenuOpen } = this.state;
        const axiosInstance = axios.create({
            baseURL: Constants.baseURL,
        });
        axiosInstance.get('/chess-load')
            .then((res) => {
                const chess = JSON.parse(res.data);
                this.setState({ ChessPositionsDataState: chess, isMenuOpen: !isMenuOpen });
                this.ChessPositions();
                this.positionsToState();
            });
    }

    resetCurrentPositions = () => {
        const { isMenuOpen } = this.state;
        const axiosInstance = axios.create({
            baseURL: Constants.baseURL,
        });
        axiosInstance.get('/chess')
            .then((res) => {
                const chess = JSON.parse(res.data);
                this.setState({ ChessPositionsDataState: chess, isMenuOpen: !isMenuOpen });
                this.ChessPositions();
                this.positionsToState();
            });
    }

    tooglerMenu() {
        const { isMenuOpen } = this.state;
        this.setState({ isMenuOpen: !isMenuOpen });
    }

    positionsToState() {
        const { ChessPositionsDataState } = this.state;
        if (ChessPositionsDataState.length > 0) {
            const elementCurrentPositions = ChessPositionsDataState.map((value) => {
                return { [value.id]: value.position };
            });
            this.setState({
                elementCurrentPositions: {
                    ...elementCurrentPositions,
                },
            });
        }
    }

    ResetActiveChess(element) {
        const { queue } = this.state;
        if (queue === 'white' && element.type === 'white') {
            this.setState({ activeElement: element.id });
        } else if (queue === 'black' && element.type === 'black') {
            this.setState({ activeElement: element.id });
        }
    }

    DoChange(newPosition, id) {
        const { ChessPositionsDataState, elementCurrentPositions } = this.state;
        for (let i = 0; i < Object.keys(elementCurrentPositions).length; i += 1) { // delete chess
            if (newPosition === elementCurrentPositions[i][i + 1]
                && id !== ChessPositionsDataState[i].id) {
                delete ChessPositionsDataState[i];
                break;
            }
        }
        const updatedPositions = {
            ...elementCurrentPositions,
            [id - 1]: { [id]: newPosition },
        };
        this.setState({
            elementCurrentPositions: updatedPositions,
            activeElement: null,
        });
        for (let i = 0; i < Object.keys(elementCurrentPositions).length; i += 1) {
            for (let j = 0; j < Object.keys(elementCurrentPositions).length; j += 1) {
                if ((j + 1) === ChessPositionsDataState[i].id
                    && elementCurrentPositions[j][j + 1]
                    !== ChessPositionsDataState[i].position
                ) {
                    ChessPositionsDataState[i].position = elementCurrentPositions[j][j + 1];
                }
            }
        }
        setTimeout(() => {
            localStorage.setItem('ChessPositionsDataState', JSON.stringify(ChessPositionsDataState));
        });
    }

    changePosition(newPosition, id, type) {
        const { queue } = this.state;
        if (queue === 'white' && type === 'white') {
            this.DoChange(newPosition, id);
            this.setState({ queue: 'black' });
        } else if (queue === 'black' && type === 'black') {
            this.DoChange(newPosition, id);
            this.setState({ queue: 'white' });
        }
    }

    checkPosition(position) {
        const { elementCurrentPositions, ChessPositionsDataState } = this.state;
        this.position = position.variantsFiltered;
        for (let i = 0; i < Object.keys(elementCurrentPositions).length; i += 1) { // delete chess
            for (let j = 0; j < this.position.length; j += 1) {
                if (this.position[j] === elementCurrentPositions[i][i + 1]
                    && ChessPositionsDataState[i].type === position.chessType) {
                    this.position.splice(j, 1);
                }
            }
        }
        return this.position;
    }

    render() {
        const rows = [];
        const rowsPositionsLiterals = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        for (let i = 0; i < 8; i += 1) {
            rows.push(<ul key={i}><li /><li /><li /><li /><li /><li /><li /><li /></ul>);
        }
        const {
            elementPoints,
            activeElement,
            elementCurrentPositions,
            ChessPositionsDataState,
            isMenuOpen,
        } = this.state;
        console.log(
            Object.keys(elementPoints).length > 0,
            ChessPositionsDataState.length > 0,
            Object.keys(elementCurrentPositions).length > 0,
        );
        return (
            <Fragment>
                <div className="chess_desck_wrapper">
                    <div className="chess_desk">
                        <div className="desk_literals">
                            <ul>
                                <li>
                                    <button
                                        className={classNames('toogler', {
                                            open: isMenuOpen,
                                        })}
                                        onClick={
                                            () => { this.tooglerMenu(); }}
                                        type="button"
                                    >
                                        <span />
                                        <span />
                                        <span />
                                        <span />
                                    </button>
                                    <div
                                        className={classNames('menu', {
                                            open: isMenuOpen,
                                        })}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => { this.loadSavedPositions(); }}
                                        >
                                            Load
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { this.saveCurrentPositions(); }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { this.resetCurrentPositions(); }}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                    <div className={classNames('overlay', {
                                        open: isMenuOpen,
                                    })}
                                    />
                                </li>
                                {rowsPositionsLiterals.map((value, idx) => {
                                    return <li key={idx}>{value}</li>;
                                })}
                                <li />
                            </ul>
                        </div>
                        <div className="desk_center">
                            <div className="desk_numbers">
                                <ul>
                                    {rowsPositionsLiterals.map((value, idx) => {
                                        return (
                                            <li key={idx}>{rowsPositionsLiterals.length - idx}</li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div
                                className="desk_table"
                                ref={(div) => {
                                    this.deskTable = div;
                                }}
                            >
                                {rows}
                            </div>
                            <div className="desk_table_positions">
                                <ul>
                                    {
                                        Object.keys(elementPoints).length > 0
                                        && ChessPositionsDataState.length > 0
                                        && Object.keys(elementCurrentPositions).length > 0
                                        && ChessPositionsDataState.map((value, idx) => {
                                            const FigureName = Figures[value.name];
                                            const chessStyle = {
                                                left: elementPoints[
                                                    elementCurrentPositions[value.id - 1][value.id]
                                                ].left,
                                                top: elementPoints[
                                                    elementCurrentPositions[value.id - 1][value.id]
                                                ].top,
                                            };
                                            return (
                                                <FigureName
                                                    data={value}
                                                    name={value.name}
                                                    img={value.img}
                                                    style={chessStyle}
                                                    currentPosition={
                                                        elementCurrentPositions[value.id]
                                                    }
                                                    elementPoints={elementPoints}
                                                    allPostions={elementCurrentPositions}
                                                    isDeleted={false}
                                                    isChessActive={value.id === activeElement}
                                                    key={idx}
                                                    changePosition={(newPosition, id, type) => {
                                                        this.changePosition(newPosition, id, type);
                                                    }}
                                                    onClick={(element) => {
                                                        this.ResetActiveChess(element);
                                                    }}
                                                    checkPosition={(position) => {
                                                        this.checkPosition(position);
                                                    }}
                                                />
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="desk_numbers">
                                <ul>
                                    {rowsPositionsLiterals.map((value, idx) => {
                                        return (
                                            <li key={idx}>{rowsPositionsLiterals.length - idx}</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="desk_literals">
                            <ul>
                                <li />
                                {rowsPositionsLiterals.map((value, idx) => {
                                    return <li key={idx}>{value}</li>;
                                })}
                                <li />
                            </ul>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default App;
