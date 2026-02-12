namespace tictactoe;

type Players : Integer enum {
    Empty = 0;
    Player1 = 1;
    Player2 = 2;
}

entity Games {
    key ID        : UUID;
        player1   : String @mandatory;
        player2   : String @mandatory;
        winner    : Players @readonly default 0;
        createdAt : Timestamp @readonly @cds.on.insert : $now;
        board     : Composition of many BoardCells
                        on board.game = $self;
}

entity BoardCells {
    key ID        : UUID;
        game      : Association to Games;
        row       : Integer @readonly;
        col       : Integer @readonly;
        value     : Players;
        modifiedAt : Timestamp @readonly @cds.on.update : $now;
}
