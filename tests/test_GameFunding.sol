pragma solidity >=0.4.22 <0.9.0;

// rerequire the Quiz contract
import "contracts/GameFunding.sol";

contract QuizTests {
    Quiz quiz;

    constructor() public {
        quiz = new Quiz();
    }

    function testCheckAnswer() public {
        // Test case 1
        bool result1 = quiz.checkAnswer(0, 'Generative Pre-training Transformer');
        assert(result1 == true);

        // Test case 2
        bool result2 = quiz.checkAnswer(1, 'Solidity');
        assert(result2 == true);

        // Test case 3
        bool result3 = quiz.checkAnswer(2, 'Bitcoin');
        assert(result3 == true);

        // Test case 4
        bool result4 = quiz.checkAnswer(3, 'Ethereum');
        assert(result4 == true);
    }
}