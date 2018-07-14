import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import Constants from '../config/Constants';

const colors = {
    deepPurple200: Constants.deepPurple200,
    indigo200: Constants.indigo200,
    green200: Constants.green200,
    lime200: Constants.lime200,
    orange200: Constants.orange200,
    blueGray200: Constants.blueGray200,
    pink200: Constants.pink200,
};

import ChessBlackBishop from '../assets/images/Chess_Black_Bishop.svg';
import ChessBlackKing from '../assets/images/Chess_Black_King.svg';
import ChessBlackKnight from '../assets/images/Chess_Black_Knight.svg';
import ChessBlackPawn from '../assets/images/Chess_Black_Pawn.svg';
import ChessBlackQueen from '../assets/images/Chess_Black_Queen.svg';
import ChessBlackRook from '../assets/images/Chess_Black_Rook.svg';
import ChessWhiteBishop from '../assets/images/Chess_White_Bishop.svg';
import ChessWhiteKing from '../assets/images/Chess_White_King.svg';
import ChessWhiteKnight from '../assets/images/Chess_White_Knight.svg';
import ChessWhitePawn from '../assets/images/Chess_White_Pawn.svg';
import ChessWhiteQueen from '../assets/images/Chess_White_Queen.svg';
import ChessWhiteRook from '../assets/images/Chess_White_Rook.svg';

const ChessIcons = {
    Chess_Black_Bishop: ChessBlackBishop,
    Chess_Black_King: ChessBlackKing,
    Chess_Black_Knight: ChessBlackKnight,
    Chess_Black_Pawn: ChessBlackPawn,
    Chess_Black_Queen: ChessBlackQueen,
    Chess_Black_Rook: ChessBlackRook,
    Chess_White_Bishop: ChessWhiteBishop,
    Chess_White_King: ChessWhiteKing,
    Chess_White_Knight: ChessWhiteKnight,
    Chess_White_Pawn: ChessWhitePawn,
    Chess_White_Queen: ChessWhiteQueen,
    Chess_White_Rook: ChessWhiteRook,
};


class DeskCell extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
        };
    }

    setAddElStyle() {
        const recivedProps = this.props;
        const colorsKeys = Object.keys(colors);
        let variants = [];
        const variantColors = [];
        if (recivedProps.variantsMove && recivedProps.variantsMove.length > 0) {
            variants = recivedProps.variantsMove;
            for (let i = 0; i < variants.length; i += 1) {
                const colorUse = colorsKeys[Math.floor(Math.random() * colorsKeys.length)];
                variantColors.push(colors[colorUse]);
            }
        }
        return ({ variants, variantColors });
    }

    CheckChess = () => {
        const recivedProps = this.props;
        const { isActive } = this.state;
        recivedProps.onClick(recivedProps.data);
        if (recivedProps.isChessActive === true) {
            this.setState({ isActive: !isActive });
        }
    }

    changeCurrentPosition(newPosition, id, type) {
        const recivedProps = this.props;
        recivedProps.changePosition(newPosition, id, type);
    }

    render() {
        const recivedProps = this.props;
        const variants = this.setAddElStyle();
        return (
            <Fragment>
                <li
                    style={recivedProps.style}
                    className={classNames({
                        active: recivedProps.isChessActive,
                    })}
                >
                    <button
                        type="button"
                        onClick={() => this.CheckChess()}
                    >
                        <img src={ChessIcons[recivedProps.img]} alt="" />
                    </button>
                    { variants.variants.length > 0 && variants.variants.map((value, idx) => {
                        const variantStyle = {
                            backgroundColor: `${variants.variantColors[idx]}`,
                            left: `${parseFloat(value.left) - parseFloat(recivedProps.style.left)}px`,
                            top: `${parseFloat(value.top) - parseFloat(recivedProps.style.top)}px`,
                            zIndex: idx + 2,
                        };
                        return (
                            <div className="variant" style={variantStyle} key={idx}>
                                <button type="button" onClick={() => this.changeCurrentPosition(value.position, recivedProps.data.id, recivedProps.data.type)} />
                            </div>
                        );
                    })}
                </li>
            </Fragment>
        );
    }
}

export default DeskCell;
