/* This program violates the principles of High-Quality Abstraction, Primitive Obsession, and Information Hiding.
 
	1. Explain why/how this program violates the above principles.
		The Game class represents the board and contains game logic. This violates High-Quality Abstraction 
		because the class is doing too much. The class also violates Primitive Obsession. It uses a string array to 
		represent the board and strings to reperesent the players instead of a more abstract data types. It also 
		violates Information Hiding because the board is publicly accessible.
	2. Explain how you would refactor the code to improve its design.
		I would split the class into multiple classes: Board, to contain the board structure, Player to contain the
		player structure, Move to contain move logic, and Game to connect it all together in a playable game. I would 
		create an enum for the players containing "X" and "O". The board class would contain a private 3x3 board array 
		that may contain only members of the players enum. Getters and setters would allow interaction with the board. 
		The Move class would contain logic for making a move and determining if a move will stop the game (win or draw). 
		Finally, the Game class may then contain game logic for handling turns and declaring the winner; it should also
		contain code for allowing a player to forfeit a game (in case they want to restart the match).


*/
export class Game {
  board: string[];

  constructor(board: string[], position: number = -1, player: string = "") {
    this.board = [...board];

    if (position >= 0 && player !== "") {
      this.board[position] = player;
    }
  }

  move(player: string): number {
    for (let i = 0; i < 9; i++) {
      if (this.board[i] == "-") {
        let game = this.play(i, player);
        if (game.winner() == player) {
          return i;
        }
      }
    }

    for (let i = 0; i < 9; i++) {
      if (this.board[i] == "-") {
        return i;
      }
    }
    return -1;
  }

  play(position: number, player: string): Game {
    return new Game(this.board, position, player);
  }

  winner(): string {
    if (
      this.board[0] != "-" &&
      this.board[0] == this.board[1] &&
      this.board[1] == this.board[2]
    ) {
      return this.board[0];
    }
    if (
      this.board[3] != "-" &&
      this.board[3] == this.board[4] &&
      this.board[4] == this.board[5]
    ) {
      return this.board[3];
    }
    if (
      this.board[6] != "-" &&
      this.board[6] == this.board[7] &&
      this.board[7] == this.board[8]
    ) {
      return this.board[6];
    }

    return "-";
  }
}

export class GameTest {
  testDefaultMove() {
    let game = new Game(this.stringToCharArray("XOXOX-OXO"));
    this.assertEquals(5, game.move("X"));

    game = new Game(this.stringToCharArray("XOXOXOOX-"));
    this.assertEquals(8, game.move("O"));

    game = new Game(this.stringToCharArray("---------"));
    this.assertEquals(0, game.move("X"));

    game = new Game(this.stringToCharArray("XXXXXXXXX"));
    this.assertEquals(-1, game.move("X"));
  }

  testFindWinningMove() {
    let game = new Game(this.stringToCharArray("XO-XX-OOX"));
    this.assertEquals(5, game.move("X"));
  }

  testWinConditions() {
    let game = new Game(this.stringToCharArray("---XXX---"));
    this.assertEquals("X", game.winner());
  }

  private assertEquals(expected: string | number, actual: string | number) {
    if (expected !== actual) {
      console.error(`${expected} != ${actual}`);
    }
  }

  private stringToCharArray(str: string): string[] {
    let result: string[] = [];
    for (const char of str) {
      result.push(char);
    }
    return result;
  }
}

// Test Driver

let gameTest = new GameTest();
gameTest.testDefaultMove();
gameTest.testFindWinningMove();
gameTest.testWinConditions();
