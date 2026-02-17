namespace tictactoe;

entity Games {
    key ID        : UUID;
        activePlayer : Integer;
        player1   : String @mandatory;
        player2   : String @mandatory;
        winner    : Integer @readonly default 0;
        createdAt : Timestamp @readonly @cds.on.insert : $now;
        board     : Composition of many BoardCells
                        on board.game = $self;
}

@cds.autoexpose
entity BoardCells {
    key ID        : UUID;
        game      : Association to Games;
        row       : Integer @readonly;
        col       : Integer @readonly;
        value     : Integer;
        modifiedAt : Timestamp @readonly @cds.on.update : $now;
}
