import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import DeskCell from './DeskCell';

class Pawn extends PureComponent {
    static propTypes = { elementPoints: PropTypes.object.isRequired }

    constructor(props) {
        super(props);
        this.state = {
            variants: [],
            elementPoints: {},
        };
    }

    componentDidMount() {
        const recivedProps = this.props;
        this.setState({ elementPoints: recivedProps.elementPoints });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ elementPoints: nextProps.elementPoints });
    }

    ChessPositionVariables = (position, id) => {
        const recivedProps = this.props;
        const { elementPoints } = this.state;
        const rowsPositionsLiterals = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const currentPositionLteral = position[id].slice(0, 1);
        const currentPositionNumber = +position[id].slice(1, 2);
        const startPositionNumber = +recivedProps.data.position.slice(1, 2);
        const newVerticalVariant = [];
        // If it's first motion from start position
        if (currentPositionNumber === startPositionNumber) {
            if (recivedProps.data.type === 'white') {
                newVerticalVariant.push({
                    ...elementPoints[
                        currentPositionLteral + (currentPositionNumber + 1)
                    ],
                    position: currentPositionLteral + (currentPositionNumber + 1),
                });
                newVerticalVariant.push({
                    ...elementPoints[
                        currentPositionLteral + (currentPositionNumber + 2)
                    ],
                    position: currentPositionLteral + (currentPositionNumber + 2),
                });
            } else {
                newVerticalVariant.push({
                    ...elementPoints[
                        currentPositionLteral + (currentPositionNumber - 1)
                    ],
                    position: currentPositionLteral + (currentPositionNumber - 1),
                });
                newVerticalVariant.push({
                    ...elementPoints[
                        currentPositionLteral + (currentPositionNumber - 2)
                    ],
                    position: currentPositionLteral + (currentPositionNumber - 2),
                });
            }
        } else if (currentPositionNumber !== startPositionNumber) {
            // If it's NOT first motion from start position
            if (recivedProps.data.type === 'white') {
                const getNextCell = currentPositionLteral + (currentPositionNumber + 1);
                let coinsedence = false;

                const leftPosition = rowsPositionsLiterals.indexOf(
                    currentPositionLteral,
                ) - 1;
                const getNextLeftCell = leftPosition >= 0
                    ? rowsPositionsLiterals[leftPosition] + (currentPositionNumber + 1) : false;

                const rightPosition = rowsPositionsLiterals.indexOf(
                    currentPositionLteral,
                ) + 1;
                const getNextRightCell = rightPosition < 8
                    ? rowsPositionsLiterals[rightPosition] + (currentPositionNumber + 1) : false;

                const thisAllPositions = recivedProps.allPostions;
                for (let i = 0; i < Object.keys(thisAllPositions).length; i += 1) {
                    if (getNextCell === thisAllPositions[i][i + 1]) {
                        coinsedence = true;
                        break;
                    }
                }
                if (getNextLeftCell) {
                    for (let j = 0; j < Object.keys(thisAllPositions).length; j += 1) {
                        if (getNextLeftCell === thisAllPositions[j][j + 1]) {
                            newVerticalVariant.push({
                                ...elementPoints[
                                    getNextLeftCell
                                ],
                                position: getNextLeftCell,
                            });
                            break;
                        }
                    }
                }
                if (getNextRightCell) {
                    for (let z = 0; z < Object.keys(thisAllPositions).length; z += 1) {
                        if (getNextRightCell === thisAllPositions[z][z + 1]) {
                            newVerticalVariant.push({
                                ...elementPoints[
                                    getNextRightCell
                                ],
                                position: getNextRightCell,
                            });
                            break;
                        }
                    }
                }
                for (let i = 0; i < Object.keys(thisAllPositions).length; i += 1) {
                    if (getNextCell === thisAllPositions[i][i + 1]) {
                        coinsedence = true;
                        break;
                    }
                }
                if (coinsedence === true) {
                    newVerticalVariant.push({
                        ...elementPoints[
                            currentPositionLteral + (currentPositionNumber)
                        ],
                        position: currentPositionLteral + (currentPositionNumber),
                    });
                } else {
                    newVerticalVariant.push({
                        ...elementPoints[
                            currentPositionLteral + (currentPositionNumber + 1)
                        ],
                        position: currentPositionLteral + (currentPositionNumber + 1),
                    });
                }
            } else if (recivedProps.data.type === 'black') {
                const getNextCell = currentPositionLteral + (currentPositionNumber - 1);

                const leftPosition = rowsPositionsLiterals.indexOf(
                    currentPositionLteral,
                ) - 1;
                const getNextLeftCell = leftPosition >= 0
                    ? rowsPositionsLiterals[leftPosition] + (currentPositionNumber - 1) : false;

                const rightPosition = rowsPositionsLiterals.indexOf(
                    currentPositionLteral,
                ) + 1;
                const getNextRightCell = rightPosition < 8
                    ? rowsPositionsLiterals[rightPosition] + (currentPositionNumber - 1) : false;

                let coinsedenceVertical = false;
                const thisAllPositions = recivedProps.allPostions;
                for (let i = 0; i < Object.keys(thisAllPositions).length; i += 1) {
                    if (getNextCell === thisAllPositions[i][i + 1]) {
                        coinsedenceVertical = true;
                        break;
                    }
                }
                if (getNextLeftCell) {
                    for (let j = 0; j < Object.keys(thisAllPositions).length; j += 1) {
                        if (getNextLeftCell === thisAllPositions[j][j + 1]) {
                            newVerticalVariant.push({
                                ...elementPoints[
                                    getNextLeftCell
                                ],
                                position: getNextLeftCell,
                            });
                            break;
                        }
                    }
                }
                if (getNextRightCell) {
                    for (let z = 0; z < Object.keys(thisAllPositions).length; z += 1) {
                        if (getNextRightCell === thisAllPositions[z][z + 1]) {
                            newVerticalVariant.push({
                                ...elementPoints[
                                    getNextRightCell
                                ],
                                position: getNextRightCell,
                            });
                            break;
                        }
                    }
                }
                if (coinsedenceVertical === true) {
                    newVerticalVariant.push({
                        ...elementPoints[
                            currentPositionLteral + currentPositionNumber
                        ],
                        position: currentPositionLteral + currentPositionNumber,
                    });
                } else {
                    newVerticalVariant.push({
                        ...elementPoints[
                            currentPositionLteral + (currentPositionNumber - 1)
                        ],
                        position: currentPositionLteral + (currentPositionNumber - 1),
                    });
                }
            }
        }
        return this.setState({ variants: newVerticalVariant });
    }

    ChessClick(element) {
        const recivedProps = this.props;
        const currentElementPosition = recivedProps.allPostions[recivedProps.data.id - 1];
        this.ChessPositionVariables(currentElementPosition, recivedProps.data.id);
        recivedProps.onClick(element);
    }

    render() {
        const recivedProps = this.props;
        const { variants } = this.state;
        return (
            <Fragment>
                <DeskCell
                    data={recivedProps.data}
                    name={recivedProps.name}
                    style={recivedProps.style}
                    isChessActive={recivedProps.isChessActive}
                    img={recivedProps.img}
                    key={recivedProps.idx}
                    variantsMove={variants}
                    changePosition={(newPostion, id, type) => {
                        recivedProps.changePosition(newPostion, id, type);
                    }}
                    onClick={(element) => {
                        this.ChessClick(element);
                    }}
                />
            </Fragment>
        );
    }
}

export default Pawn;
