using tictactoe from '../db/schema';

service GameService {
    entity Games as projection on tictactoe.Games;
    entity BoardCells as projection on tictactoe.BoardCells;
}
