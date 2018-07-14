import React, { PureComponent, Fragment } from 'react';
import DeskCell from './DeskCell';

class Rook extends PureComponent {
    ChessClick(element) {
        const recivedProps = this.props;
        recivedProps.onClick(element);
    }

    render() {
        const recivedProps = this.props;
        return (
            <Fragment>
                <DeskCell
                    data={recivedProps.data}
                    name={recivedProps.name}
                    style={recivedProps.style}
                    isChessActive={recivedProps.isChessActive}
                    img={recivedProps.img}
                    key={recivedProps.idx}
                    onClick={(element) => { this.ChessClick(element); }}
                />
            </Fragment>
        );
    }
}

export default Rook;
