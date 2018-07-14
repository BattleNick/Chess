import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import DeskCell from './DeskCell';

class Knight extends PureComponent {
    static propTypes = { elementPoints: PropTypes.object.isRequired }

    constructor(props) {
        super(props);
        this.state = {
            variants: [],
            elementPoints: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ elementPoints: nextProps.elementPoints });
    }

    ChessPositionVariables = (position, id) => {
        const recivedProps = this.props;
        const { elementPoints } = this.state;
        const rowsPositionsLiterals = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const currentPositionLiteral = position[id].slice(0, 1);
        const currentPositionNumber = +position[id].slice(1, 2);
        const currentPositionLiteralIndex = rowsPositionsLiterals.findIndex(
            k => k === currentPositionLiteral,
        );
        const startPositionNumber = +recivedProps.data.position.slice(1, 2);
        const newVerticalVariant = [];
        // If it's first motion from start position
        if (currentPositionNumber === startPositionNumber) {
            if (recivedProps.data.type === 'white') {
                newVerticalVariant.push({
                    ...elementPoints[
                        rowsPositionsLiterals[currentPositionLiteralIndex - 1]
                        + (currentPositionNumber + 2)
                    ],
                    position: rowsPositionsLiterals[currentPositionLiteralIndex - 1]
                    + (currentPositionNumber + 2),
                });
                newVerticalVariant.push({
                    ...elementPoints[
                        rowsPositionsLiterals[currentPositionLiteralIndex + 1]
                        + (currentPositionNumber + 2)
                    ],
                    position: rowsPositionsLiterals[currentPositionLiteralIndex + 1]
                    + (currentPositionNumber + 2),
                });
            } else {
                newVerticalVariant.push({
                    ...elementPoints[
                        rowsPositionsLiterals[currentPositionLiteralIndex - 1]
                        + (currentPositionNumber - 2)
                    ],
                    position: rowsPositionsLiterals[currentPositionLiteralIndex - 1]
                    + (currentPositionNumber - 2),
                });
                newVerticalVariant.push({
                    ...elementPoints[
                        rowsPositionsLiterals[currentPositionLiteralIndex + 1]
                        + (currentPositionNumber - 2)
                    ],
                    position: rowsPositionsLiterals[currentPositionLiteralIndex + 1]
                    + (currentPositionNumber - 2),
                });
            }
        } else if (currentPositionNumber !== startPositionNumber) {
            const chessType = recivedProps.data.type;
            // If it's NOT first motion from start position

            /* ---varinats of positions--- */
            const topLeftPosition = rowsPositionsLiterals.indexOf(
                currentPositionLiteral,
            ) - 1;
            const getNextTopLeftCell = (topLeftPosition) >= 0
                ? rowsPositionsLiterals[topLeftPosition]
                + (currentPositionNumber + 2) : false;

            const topRightPosition = rowsPositionsLiterals.indexOf(
                currentPositionLiteral,
            ) + 1;
            const getNextTopRightTopCell = topRightPosition < 8
                ? rowsPositionsLiterals[topRightPosition]
                + (currentPositionNumber + 2) : false;

            const rightTopPosition = rowsPositionsLiterals.indexOf(
                currentPositionLiteral,
            ) + 2;
            const getNextRightTopCell = rightTopPosition < 8
                ? rowsPositionsLiterals[rightTopPosition]
                + (currentPositionNumber + 1) : false;

            const rightBottomPosition = rowsPositionsLiterals.indexOf(
                currentPositionLiteral,
            ) + 2;
            const getNextRightBottomCell = rightBottomPosition < 8
                ? rowsPositionsLiterals[rightBottomPosition]
                + (currentPositionNumber - 1) : false;

            const bottomRightPosition = rowsPositionsLiterals.indexOf(
                currentPositionLiteral,
            ) + 1;
            const getNextbottomRightCell = bottomRightPosition < 8
                ? rowsPositionsLiterals[bottomRightPosition]
                + (currentPositionNumber - 2) : false;

            const bottomLeftPosition = rowsPositionsLiterals.indexOf(
                currentPositionLiteral,
            ) - 1;
            const getNextBottomLeftCell = (bottomLeftPosition) >= 0
                ? rowsPositionsLiterals[bottomLeftPosition]
                + (currentPositionNumber - 2) : false;

            const leftTopPosition = rowsPositionsLiterals.indexOf(
                currentPositionLiteral,
            ) - 2;
            const getNextLeftTopCell = leftTopPosition >= 0
                ? rowsPositionsLiterals[leftTopPosition]
                + (currentPositionNumber + 1) : false;

            const leftBottomPosition = rowsPositionsLiterals.indexOf(
                currentPositionLiteral,
            ) - 2;
            const getNextLeftBottomCell = leftBottomPosition >= 0
                ? rowsPositionsLiterals[leftBottomPosition]
                + (currentPositionNumber - 1) : false;

            const allKnightVariants = [
                getNextTopLeftCell,
                getNextTopRightTopCell,
                getNextRightTopCell,
                getNextRightBottomCell,
                getNextbottomRightCell,
                getNextBottomLeftCell,
                getNextLeftTopCell,
                getNextLeftBottomCell,
            ];

            const variantsFiltered = allKnightVariants.filter(variant => variant !== false);

            recivedProps.checkPosition({ variantsFiltered, chessType });

            variantsFiltered.map((value) => {
                return (newVerticalVariant.push({
                    ...elementPoints[
                        value
                    ],
                    position: value,
                }));
            });
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

export default Knight;
