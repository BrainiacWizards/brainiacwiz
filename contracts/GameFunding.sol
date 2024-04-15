import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
pragma solidity >=0.4.22 <0.9.0;

contract Quiz {
    struct Question {
        string question;
        string[4] options;
        string answer;
    }

    Question[] public questions;
    
    IERC20 public token;

    constructor(IERC20 _token) public {
        token = _token;
    }

        // Tech Trends
        string[4] memory options0 = ["Generative Pre-training Transformer", "General Purpose Transistor", "Global Positioning Technology", "Gigabit Transfer Protocol"];
        questions.push(Question('What does GTP Stand for?', options0, 'Generative Pre-training Transformer'));

        string[4] memory options1 = ["Solidity", "Python", "Java", "C++"];
        questions.push(Question('What language is used to write smart contracts on the Ethereum blockchain?', options1, 'Solidity'));

        string[4] memory options2 = ["Bitcoin", "Ethereum", "Ripple", "Litecoin"];
        questions.push(Question('What is the name of the first cryptocurrency?', options2, 'Bitcoin'));

        string[4] memory options3 = ["Ethereum", "Bitcoin", "Ripple", "Litecoin"];
        questions.push(Question('Which cryptocurrency platform first introduced smart contracts?', options3, 'Ethereum'));
    }

    function checkAnswer(uint _questionIndex, string memory _answer) public {
        require(_questionIndex < questions.length, "Invalid question index");
        require(token.balanceOf(address(this)) > 0, "No tokens left to reward");

        Question memory question = questions[_questionIndex];
        require(keccak256(abi.encodePacked(question.answer)) == keccak256(abi.encodePacked(_answer)), "Incorrect answer");

        // Transfer a token to the caller if the answer is correct
        token.transfer(msg.sender, 1);
    }
}