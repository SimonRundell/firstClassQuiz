-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 19, 2026 at 12:04 PM
-- Server version: 11.8.8-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u240325118_mwb`
--
-- CREATE DATABASE IF NOT EXISTS `u240325118_mwb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `u240325118_mwb`;

-- --------------------------------------------------------

--
-- Table structure for table `firstclassquiz_admins`
--

DROP TABLE IF EXISTS `firstclassquiz_admins`;
CREATE TABLE `firstclassquiz_admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `display_name` varchar(150) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `firstclassquiz_admins`
--

INSERT INTO `firstclassquiz_admins` (`id`, `username`, `password_hash`, `display_name`, `created_at`) VALUES
(1, 'simonrundell@exe-coll.ac.uk', '$2y$10$KwRY4gp5ewtLkkmBls1ZTel8gZ.vyq5ILOHMnmbV7V8f.3v3E.I9a', 'Simon Rundell', '2026-07-30 10:10:15');

-- --------------------------------------------------------

--
-- Table structure for table `firstclassquiz_questions`
--

DROP TABLE IF EXISTS `firstclassquiz_questions`;
CREATE TABLE `firstclassquiz_questions` (
  `id` int(10) UNSIGNED NOT NULL,
  `set_id` int(10) UNSIGNED NOT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `type` enum('text','likert','choice') NOT NULL,
  `prompt` text NOT NULL,
  `required` tinyint(1) NOT NULL DEFAULT 1,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `firstclassquiz_questions`
--

INSERT INTO `firstclassquiz_questions` (`id`, `set_id`, `sort_order`, `type`, `prompt`, `required`, `config`) VALUES
(1, 1, 0, 'text', 'What is your top value and why?', 1, '[]'),
(2, 1, 1, 'likert', 'What has been your experience with school up to this point', 1, '{\"points\":5,\"labels\":[\"Absolutely terrible\",\"Pretty bad\",\"Meh\",\"Pretty good\",\"Fantastic\"]}'),
(3, 1, 2, 'text', 'What matters most to you from a Class or a Teacher?', 1, '[]'),
(4, 1, 3, 'text', 'What is an interesting or boring fact about yourself?', 1, '[]'),
(5, 1, 4, 'text', 'What is helpful for your teacher to know to better support you right away in these Classes?', 1, '[]'),
(10, 4, 0, 'choice', '<p>Complete the formula: data + ___ = information</p>', 1, '{\"options\":[\"Processing\",\"Context\",\"Storage\",\"Structure\"],\"allowMultiple\":false}'),
(11, 4, 1, 'choice', '<p>Which data type would you use to store a person\'s age?</p>', 1, '{\"options\":[\"Integer\",\"Float (Real)\",\"String\",\"Boolean\"],\"allowMultiple\":false}'),
(12, 4, 2, 'choice', '<p>Why would you store a postcode such as EX4 3PL as a String rather than an Integer?</p>', 1, '{\"options\":[\"Because it is too long to be a number\",\"Because we do not perform arithmetic on postcodes, so treating it as text is correct\",\"Because Integers cannot store letters\",\"I don\'t know\"],\"allowMultiple\":false}'),
(13, 4, 3, 'text', '<p>Name all five data types covered in this lesson.</p>', 1, '[]'),
(14, 4, 4, 'choice', '<p>Which of these storage devices has no moving parts?</p>', 1, '{\"options\":[\"HDD (Hard Disk Drive)\",\"SSD (Solid State Drive)\",\"Floppy disk\",\"Punched card\"],\"allowMultiple\":false}'),
(15, 4, 5, 'choice', '<p>What does DRY stand for in programming?</p>', 1, '{\"options\":[\"Do Repeat Yourself\",\"Don\'t Repeat Yourself\",\"Design, Refactor, Yield\"],\"allowMultiple\":false}'),
(16, 4, 6, 'choice', '<p>What does WET stand for in the context of coding?</p>', 1, '{\"options\":[\"We Enjoy Typing\",\"Write Everything Twice\",\"Weakly Encoded Text\"],\"allowMultiple\":false}'),
(17, 4, 7, 'text', '<p>In your own words, what is a unit of code? Give an example.</p>', 1, '[]'),
(18, 4, 8, 'choice', '<p>Which of the following are examples of open source software? Select all that apply.</p>', 1, '{\"options\":[\"Linux Operating System\",\"Python\",\"Microsoft Office\",\"Adobe Photoshop\"],\"allowMultiple\":true}'),
(19, 4, 9, 'likert', '<p>How confident do you feel explaining the difference between DRY and WET code?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(20, 5, 0, 'choice', '<p>Complete the formula: data + ___ = information</p>', 1, '{\"options\":[\"Processing\",\"Context\",\"Storage\",\"Structure\"],\"allowMultiple\":false}'),
(21, 5, 1, 'choice', '<p>Which data type would you use to store a person\'s age?</p>', 1, '{\"options\":[\"Integer\",\"Float (Real)\",\"String\",\"Boolean\"],\"allowMultiple\":false}'),
(22, 5, 2, 'choice', '<p>Why would you store a postcode such as EX4 3PL as a String rather than an Integer?</p>', 1, '{\"options\":[\"Because it is too long to be a number\",\"Because we do not perform arithmetic on postcodes, so treating it as text is correct\",\"Because Integers cannot store letters\",\"I don\'t know\"],\"allowMultiple\":false}'),
(23, 5, 3, 'text', '<p>Name the principle data types we have covered (so far)</p>', 1, '[]'),
(24, 5, 4, 'choice', '<p>Which of these storage devices has no moving parts?</p>', 1, '{\"options\":[\"HDD (Hard Disk Drive)\",\"SSD (Solid State Drive)\",\"Floppy disk\",\"Punched card\"],\"allowMultiple\":false}'),
(25, 5, 5, 'choice', '<p>What does DRY stand for in programming?</p>', 1, '{\"options\":[\"Do Repeat Yourself\",\"Don\'t Repeat Yourself\",\"Design, Refactor, Yield\"],\"allowMultiple\":false}'),
(26, 5, 6, 'choice', '<p>What does WET stand for in the context of coding?</p>', 1, '{\"options\":[\"We Enjoy Typing\",\"Write Everything Twice\",\"Weakly Encoded Text\"],\"allowMultiple\":false}'),
(27, 5, 7, 'text', '<p>In your own words, what is a unit of code? Give an example.</p>', 1, '[]'),
(28, 5, 8, 'choice', '<p>Which of the following are examples of open source software? Select all that apply.</p>', 1, '{\"options\":[\"Linux Operating System\",\"Python\",\"Microsoft Office\",\"Adobe Photoshop\"],\"allowMultiple\":true}'),
(29, 5, 9, 'likert', '<p>How confident do you feel explaining the difference between DRY and WET code?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(30, 6, 0, 'choice', '<p>Which naming convention is the Python standard for variable names?</p>', 1, '{\"options\":[\"camelCase\",\"snake_case\",\"PascalCase\",\"kebab-case\"],\"allowMultiple\":false}'),
(31, 6, 1, 'choice', '<p>What does robust code mean?</p>', 1, '{\"options\":[\"Code that runs as fast as possible\",\"Code that anticipates and handles unexpected situations without crashing\",\"Code with the fewest possible lines\",\"Code that never contains a loop\"],\"allowMultiple\":false}'),
(32, 6, 2, 'choice', '<p>What is the purpose of a try/except block?</p>', 1, '{\"options\":[\"To repeat code a fixed number of times\",\"To catch and handle an error instead of the program crashing\",\"To declare a constant\",\"To open a file\"],\"allowMultiple\":false}'),
(33, 6, 3, 'text', '<p>Explain why readability matters when writing code, and name one naming convention that supports it.</p>', 1, '[]'),
(34, 7, 0, 'choice', '<p>Which search algorithm requires the data to already be sorted?</p>', 1, '{\"options\":[\"Linear search\",\"Binary search\",\"Bubble sort\",\"Insertion sort\"],\"allowMultiple\":false}'),
(35, 7, 1, 'choice', '<p>How does bubble sort work?</p>', 1, '{\"options\":[\"It repeatedly halves a sorted list to find a target\",\"It repeatedly compares and swaps adjacent items until the list is sorted\",\"It builds a sorted section of the list one item at a time\",\"It splits the list in half and merges sorted halves back together\"],\"allowMultiple\":false}'),
(36, 7, 2, 'choice', '<p>Which of the following are ways this lesson compares search and sort algorithms, given that Big O notation is not required at this level? Select all that apply.</p>', 1, '{\"options\":[\"Memory use\",\"Execution time\",\"Number of comparisons\",\"Number of comments in the code\"],\"allowMultiple\":true}'),
(37, 7, 3, 'text', '<p>Explain what best case and worst case mean for a searching or sorting algorithm, using an example.</p>', 1, '[]'),
(38, 8, 0, 'choice', '<p>Why are individual components tested before integration?</p>', 1, '{\"options\":[\"To save time by skipping the final system test\",\"To catch faults early, before they are harder to trace in the full system\",\"Because integration testing is not possible in Python\",\"Because components cannot be tested on their own\"],\"allowMultiple\":false}'),
(39, 8, 1, 'choice', '<p>What is the difference between closed box and open box testing?</p>', 1, '{\"options\":[\"There is no real difference\",\"Closed box has no knowledge of the code; open box uses knowledge of its structure\",\"Closed box is always automated; open box is always manual\",\"Open box testing is only used for hardware\"],\"allowMultiple\":false}'),
(40, 9, 0, 'choice', '<p>What is sequence in programming?</p>', 1, '{\"options\":[\"Choosing between paths based on a condition\",\"Instructions executed one after another in order\",\"Repeating a block of code\",\"A type of data structure\"],\"allowMultiple\":false}'),
(41, 9, 1, 'choice', '<p>In an if/elif/else chain, when is the elif condition checked?</p>', 1, '{\"options\":[\"Always, regardless of the if condition\",\"Only if the if condition was False\",\"Only if the if condition was True\",\"Never, it is ignored\"],\"allowMultiple\":false}'),
(42, 9, 2, 'choice', '<p>Which Python structure would you use to compare one variable against several fixed values cleanly?</p>', 1, '{\"options\":[\"A for loop\",\"match\\/case\",\"A dictionary\",\"A while loop\"],\"allowMultiple\":false}'),
(43, 9, 3, 'choice', '<p>A flowchart diamond shape represents which part of an algorithm?</p>', 1, '{\"options\":[\"An input\",\"A process\",\"A decision (selection)\",\"An output\"],\"allowMultiple\":false}'),
(44, 10, 0, 'choice', '<p>Which type of loop repeats a known, fixed number of times?</p>', 1, '{\"options\":[\"A while loop\",\"A for loop\",\"An if statement\",\"A function\"],\"allowMultiple\":false}'),
(45, 10, 1, 'choice', '<p>What commonly causes an infinite loop in a while loop?</p>', 1, '{\"options\":[\"Using range() instead of a condition\",\"Forgetting to update the condition inside the loop\",\"Using a for loop instead\",\"Declaring too many variables\"],\"allowMultiple\":false}'),
(46, 10, 2, 'choice', '<p>What is an off-by-one error?</p>', 1, '{\"options\":[\"A syntax error that stops the program running\",\"A bug where a loop runs one time too many or too few\",\"An error caused by dividing by zero\",\"A missing colon after a for statement\"],\"allowMultiple\":false}'),
(47, 11, 0, 'choice', '<p>What is the key difference between a function and a procedure?</p>', 1, '{\"options\":[\"Procedures cannot take parameters\",\"A function must return a result, a procedure must not\",\"Functions cannot be reused\",\"There is no difference in Python\"],\"allowMultiple\":false}'),
(48, 11, 1, 'choice', '<p>What is a parameter?</p>', 1, '{\"options\":[\"The result a function sends back\",\"A named input a function expects to receive\",\"A type of loop\",\"An error message\"],\"allowMultiple\":false}'),
(49, 11, 2, 'choice', '<p>Which of the following are benefits of using pre-written library code? Select all that apply.</p>', 1, '{\"options\":[\"It saves development time\",\"It is often well tested\",\"It guarantees your program has no bugs at all\",\"It removes the need to test your program entirely\"],\"allowMultiple\":true}'),
(50, 11, 3, 'choice', '<p>Which of these is a Python built-in function?</p>', 1, '{\"options\":[\"len()\",\"myFunction()\",\"randomLib()\",\"customCode()\"],\"allowMultiple\":false}'),
(51, 12, 0, 'choice', '<p>What does a presence check test?</p>', 1, '{\"options\":[\"That a number is within range\",\"That a field has not been left empty\",\"That data is the correct type\",\"That a value matches a pattern\"],\"allowMultiple\":false}'),
(52, 12, 1, 'choice', '<p>Does validation guarantee that data is true?</p>', 1, '{\"options\":[\"Yes, always\",\"No, it only checks that data is sensible and in the right format\",\"Only for numeric data\",\"Only if a check digit is used\"],\"allowMultiple\":false}'),
(53, 12, 2, 'choice', '<p>Which validation check might catch someone typing text into a numeric age field?</p>', 1, '{\"options\":[\"Presence check\",\"Type check\",\"Length check\",\"Format check\"],\"allowMultiple\":false}'),
(54, 12, 3, 'text', '<p>Explain how a while loop can be combined with a validation check to force a user to re-enter data until it is valid.</p>', 1, '[]'),
(55, 13, 0, 'choice', '<p>Which data type would you use to store a person\'s age in whole years?</p>', 1, '{\"options\":[\"String\",\"Integer\",\"Float\",\"Boolean\"],\"allowMultiple\":false}'),
(56, 13, 1, 'choice', '<p>What does input() always return in Python, before any conversion?</p>', 1, '{\"options\":[\"An integer\",\"A float\",\"A string\",\"A Boolean\"],\"allowMultiple\":false}'),
(57, 13, 2, 'choice', '<p>What is the main difference between a variable and a constant?</p>', 1, '{\"options\":[\"Constants can only store numbers\",\"A constant\'s value should not change once set\",\"Variables cannot be printed\",\"There is no difference in Python\"],\"allowMultiple\":false}'),
(58, 13, 3, 'choice', '<p>A variable created inside a function, and not accessible outside it, has what kind of scope?</p>', 1, '{\"options\":[\"Global scope\",\"Local scope\",\"Public scope\",\"Constant scope\"],\"allowMultiple\":false}'),
(59, 14, 0, 'choice', '<p>What position does the first item in a Python list have?</p>', 1, '{\"options\":[\"1\",\"0\",\"-1\",\"It depends on the list\"],\"allowMultiple\":false}'),
(60, 14, 1, 'choice', '<p>Which error is raised when you try to access a dictionary key that does not exist?</p>', 1, '{\"options\":[\"IndexError\",\"KeyError\",\"ValueError\",\"SyntaxError\"],\"allowMultiple\":false}'),
(61, 14, 2, 'choice', '<p>Which data structure is best suited to storing a student record where each field has a clear name, such as \'name\' and \'age\'?</p>', 1, '{\"options\":[\"List\",\"Dictionary\",\"String\",\"Boolean\"],\"allowMultiple\":false}'),
(62, 15, 0, 'choice', '<p>Which Python operator performs division that discards the remainder (integer division)?</p>', 1, '{\"options\":[\"\\/\",\"\\/\\/\",\"%\",\"**\"],\"allowMultiple\":false}'),
(63, 15, 1, 'choice', '<p>What do relational operators such as ==, &lt; and &gt; always evaluate to?</p>', 1, '{\"options\":[\"A number\",\"A string\",\"A Boolean\",\"A list\"],\"allowMultiple\":false}'),
(64, 16, 0, 'choice', '<p>Why is with open(...) as f: preferred over calling open() and close() separately?</p>', 1, '{\"options\":[\"It runs faster\",\"Python closes the file automatically, even if an error occurs\",\"It is the only way to read a file\",\"It prevents the file from being edited\"],\"allowMultiple\":false}'),
(65, 17, 0, 'choice', '<p>What must be true of a list before you can perform a binary search on it?</p>', 1, '{\"options\":[\"It must contain fewer than 10 items\",\"It must be sorted\",\"It must contain only numbers, not text\",\"I don\'t know\"],\"allowMultiple\":false}'),
(66, 17, 1, 'choice', '<p>What is the Big-O notation for linear search?</p>', 1, '{\"options\":[\"O(1)\",\"O(n)\",\"O(log n)\",\"I don\'t know\"],\"allowMultiple\":false}'),
(67, 17, 2, 'choice', '<p>Roughly how many guesses are needed to find a number between 1 and 100 using a binary search style approach, and why?</p>', 1, '{\"options\":[\"About 100, because you must check every number\",\"About 7, because each guess roughly halves the remaining possibilities\",\"About 50, because you always start in the middle and stop\",\"I don\'t know\"],\"allowMultiple\":false}'),
(68, 17, 3, 'choice', '<p>Which of the following are sorting algorithms covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Bubble sort\",\"Insertion sort\",\"Merge sort\",\"Binary sort\"],\"allowMultiple\":true}'),
(69, 17, 4, 'text', '<p>Explain what Big-O notation measures, and why it is described as a growth pattern rather than a timing.</p>', 1, '[]'),
(70, 18, 0, 'choice', '<p>What is the purpose of Root Cause Analysis (RCA)?</p>', 1, '{\"options\":[\"To fix the symptom of a problem as quickly as possible\",\"To identify the underlying cause of a problem, not just treat its symptoms\",\"To assign blame for an incident\",\"I don\'t know\"],\"allowMultiple\":false}'),
(71, 18, 1, 'choice', '<p>In the Five Whys technique, what happens to each answer?</p>', 1, '{\"options\":[\"It is ignored and a new, unrelated question is asked\",\"It becomes the next WHY question, until the real cause appears\",\"It is immediately escalated to a manager\",\"I don\'t know\"],\"allowMultiple\":false}'),
(72, 18, 2, 'choice', '<p>In FMEA, how is the Risk Priority Number (RPN) calculated?</p>', 1, '{\"options\":[\"Severity + Occurrence + Detection\",\"Severity multiplied by Occurrence multiplied by Detection\",\"Severity divided by Occurrence\",\"I don\'t know\"],\"allowMultiple\":false}'),
(73, 18, 3, 'choice', '<p>How does Event Tree Analysis (ETA) differ from the Five Whys technique?</p>', 1, '{\"options\":[\"ETA traces all possible outcomes forward from an initiating event, while Five Whys looks backward to find one cause\",\"They are exactly the same technique with different names\",\"ETA is only used for hardware failures, Five Whys only for software\",\"I don\'t know\"],\"allowMultiple\":false}'),
(74, 18, 4, 'choice', '<p>Which of the following are correct post-RCA actions, as covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Log\",\"Close\",\"Escalate\",\"Delete all records of the incident\"],\"allowMultiple\":true}'),
(75, 19, 0, 'choice', '<p>Which of the following are among the five key qualities of an algorithm covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Finite\",\"Definite (unambiguous)\",\"Effective\",\"Written only in Python\"],\"allowMultiple\":true}'),
(76, 19, 1, 'choice', '<p>What does the sub-process flowchart symbol mean?</p>', 1, '{\"options\":[\"The algorithm has finished and stopped\",\"A whole other flowchart happens here\",\"A decision must be made\",\"I don\'t know\"],\"allowMultiple\":false}'),
(77, 19, 2, 'choice', '<p>Which of the following are the three ways of controlling the order of steps in an algorithm, as covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Sequence\",\"Selection\",\"Iteration\",\"Abstraction\"],\"allowMultiple\":true}'),
(78, 19, 3, 'choice', '<p>What is a trace table used for?</p>', 1, '{\"options\":[\"Drawing the flowchart symbols in the correct shape\",\"Recording the value of every variable at every step, to work out an algorithm\'s output\",\"Listing the requirements of a system\",\"I don\'t know\"],\"allowMultiple\":false}'),
(79, 19, 4, 'text', '<p>Explain the difference between a syntax-style error and a logic error you might find while debugging a flowchart, such as an infinite loop versus a missing output.</p>', 1, '[]'),
(80, 20, 0, 'choice', '<p>What is pseudocode?</p>', 1, '{\"options\":[\"A structured outline of a solution using programming logic but no strict language syntax\",\"A diagram made only of boxes and arrows\",\"A fully executable Python program\",\"I don\'t know\"],\"allowMultiple\":false}'),
(81, 20, 1, 'choice', '<p>In Pearson pseudocode conventions, which keyword is used to assign a value to a variable?</p>', 1, '{\"options\":[\"SET ... TO\",\"RECEIVE ... FROM\",\"PRINT ... AS\",\"I don\'t know\"],\"allowMultiple\":false}'),
(82, 20, 2, 'choice', '<p>Which of the following are drawbacks of written descriptions (plain English with hierarchical markers), as covered in this lesson?</p>', 1, '{\"options\":[\"They cannot be read by a customer\",\"They can be ambiguous, since two readers can honestly disagree\",\"They require knowledge of a specific programming language\",\"I don\'t know\"],\"allowMultiple\":false}'),
(83, 20, 3, 'choice', '<p>Which of the following are true advantages of code compared with pseudocode, as covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Code is precise and executable\",\"Code is testable immediately\",\"Code can be read by anyone regardless of programming knowledge\",\"Pseudocode cannot be run or tested\"],\"allowMultiple\":true}'),
(84, 20, 4, 'likert', '<p>How confident do you feel translating between a flowchart, pseudocode and Python code for the same algorithm?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(85, 21, 0, 'choice', '<p>Which of the following are among the four tasks of decomposition covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Identify the main features of a problem\",\"Characterise each identified feature\",\"Break problems down into smaller parts\",\"Merge all solutions into a single module\"],\"allowMultiple\":true}'),
(86, 21, 1, 'text', '<p>Explain what a requirement is in the context of decomposition, and give one example from a system of your choice.</p>', 1, '[]'),
(87, 22, 0, 'choice', '<p>What is the purpose of pattern recognition in computational thinking?</p>', 1, '{\"options\":[\"To find and interpret trends and similarities within and between problems and processes\",\"To break a large problem into smaller manageable parts\",\"To remove unnecessary detail from a problem\",\"I don\'t know\"],\"allowMultiple\":false}'),
(88, 22, 1, 'choice', '<p>Which of the following are described as one of the three key areas of pattern recognition in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Identifying common elements\",\"Identifying common factors\",\"Identifying behaviour patterns\",\"Identifying black boxes\"],\"allowMultiple\":true}'),
(89, 22, 2, 'choice', '<p>What is pareidolia, as discussed in this lesson?</p>', 1, '{\"options\":[\"A programming technique for sorting data\",\"The human tendency to see patterns, such as faces, that are not really there\",\"A type of encryption used to break Enigma\",\"I don\'t know\"],\"allowMultiple\":false}'),
(90, 22, 3, 'text', '<p>Explain why recognising common elements in a problem can save a programmer work.</p>', 1, '[]'),
(91, 23, 0, 'choice', '<p>What is the purpose of abstraction in computational thinking?</p>', 1, '{\"options\":[\"To find repeated trends between different problems\",\"To remove unnecessary detail so you can focus on what actually matters\",\"To break instructions into precise, ordered steps\",\"I don\'t know\"],\"allowMultiple\":false}'),
(92, 23, 1, 'choice', '<p>Which of the following are among the three tasks of abstraction covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Identify the information that is needed\",\"Filter out unnecessary details\",\"Hide details of internal workings\",\"Characterise every feature of the problem\"],\"allowMultiple\":true}'),
(93, 23, 2, 'choice', '<p>What can happen if a problem is over-abstracted?</p>', 1, '{\"options\":[\"You drown in irrelevant detail and the solution never gets designed\",\"You throw away detail the solution actually needed\",\"The solution becomes impossible to represent as a black box\",\"I don\'t know\"],\"allowMultiple\":false}'),
(94, 23, 3, 'likert', '<p>How confident do you feel applying the six-point abstraction checklist to a new scenario?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(95, 24, 0, 'choice', '<p>Which of the following are the four components of computational thinking? Select all that apply.</p>', 1, '{\"options\":[\"Decomposition\",\"Pattern recognition\",\"Abstraction\",\"Program design\"],\"allowMultiple\":true}'),
(96, 24, 1, 'choice', '<p>In top-down design, what is a black box?</p>', 1, '{\"options\":[\"A component we describe by what it does, not how it does it\",\"A component that has failed and needs debugging\",\"A diagram showing data moving between modules\",\"I don\'t know\"],\"allowMultiple\":false}'),
(97, 24, 2, 'choice', '<p>Which of these is a good reason to use computational thinking on a problem?</p>', 1, '{\"options\":[\"A documented fix already exists for the problem\",\"The problem is new and no known solution exists\",\"The problem only happens once and is trivial\",\"I don\'t know\"],\"allowMultiple\":false}'),
(98, 24, 3, 'text', '<p>Explain what abstraction means in computational thinking, using an example of detail you would remove from a real-world scenario.</p>', 1, '[]'),
(99, 25, 0, 'choice', '<p>What is bottom-up design?</p>', 1, '{\"options\":[\"Starting with the big idea and repeatedly breaking it down into component parts\",\"Designing the individual base elements in detail first, then linking them into larger systems\",\"Writing code without any planning first\",\"I don\'t know\"],\"allowMultiple\":false}'),
(100, 25, 1, 'choice', '<p>Which of the following are benefits of modular design? Select all that apply.</p>', 1, '{\"options\":[\"Modules can be changed or redeveloped without breaking the wider system\",\"Different modules can be assigned to different team members\",\"It removes the need for any interfaces between modules\",\"Minimum data redundancy and better reusability\"],\"allowMultiple\":true}'),
(101, 25, 2, 'choice', '<p>In this lesson\'s comparison table, which approach is more closely associated with object-oriented languages such as Java, C++ and Python OOP?</p>', 1, '{\"options\":[\"Top-down\",\"Bottom-up\",\"Neither, the choice of language makes no difference\",\"I don\'t know\"],\"allowMultiple\":false}'),
(102, 25, 3, 'text', '<p>In one sentence, explain when you would choose bottom-up design over top-down design.</p>', 1, '[]'),
(103, 26, 0, 'choice', '<p>What is decomposition?</p>', 1, '{\"options\":[\"Breaking a complex problem or situation into more manageable units or requirements\",\"Combining several small modules into one large program\",\"Removing unnecessary detail from a problem\",\"I don\'t know\"],\"allowMultiple\":false}'),
(104, 26, 1, 'choice', '<p>Which of the following are among the five methods of representing decomposition covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Block diagram\",\"Information flow diagram\",\"Flowchart\",\"Written description\"],\"allowMultiple\":true}'),
(105, 27, 0, 'choice', '<p>Which of the following are among the four hallmarks of a project, as covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"A defined goal\",\"A start and end date\",\"Multiple people or resources\",\"Being completed by a single person with no deadline\"],\"allowMultiple\":true}'),
(106, 27, 1, 'choice', '<p>Which phase of the project management lifecycle involves the main build and test work?</p>', 1, '{\"options\":[\"Initiate\",\"Execute\",\"Close\",\"I don\'t know\"],\"allowMultiple\":false}'),
(107, 27, 2, 'choice', '<p>Which of the following are core responsibilities of a Project Manager, as covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Coordination\",\"Risk Management\",\"Stakeholder Management\",\"Personally writing all of the code\"],\"allowMultiple\":true}'),
(108, 27, 3, 'text', '<p>Explain, in your own words, what is meant by project management, and give one example of a stakeholder who is not an end user.</p>', 1, '[]'),
(109, 28, 0, 'choice', '<p>What is the core purpose of Lean project management?</p>', 1, '{\"options\":[\"To complete each phase fully before the next begins\",\"To eliminate waste so the team delivers more value with the same effort\",\"To maximise documentation at every stage\",\"I don\'t know\"],\"allowMultiple\":false}'),
(110, 28, 1, 'choice', '<p>In Waterfall project management, what must happen before the next phase begins?</p>', 1, '{\"options\":[\"Nothing, phases can run in any order\",\"The current phase must be completed fully\",\"Only the client needs to approve verbally\",\"I don\'t know\"],\"allowMultiple\":false}'),
(111, 28, 2, 'choice', '<p>A client wants to increase the scope of a project without increasing the budget or deadline. According to the triple constraint, what is likely to happen?</p>', 1, '{\"options\":[\"Nothing, scope can always be added for free\",\"Quality is likely to suffer, or the scope must be renegotiated\",\"The project will automatically finish early\",\"I don\'t know\"],\"allowMultiple\":false}'),
(112, 28, 3, 'likert', '<p>How confident do you feel explaining the triple constraint (scope, time, cost) to someone else?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(113, 29, 0, 'choice', '<p>Which of the following are values from the Agile Manifesto? Select all that apply.</p>', 1, '{\"options\":[\"Individuals and interactions over processes and tools\",\"Working software over comprehensive documentation\",\"Customer collaboration over contract negotiation\",\"Following a fixed plan over responding to change\"],\"allowMultiple\":true}'),
(114, 29, 1, 'choice', '<p>What is scope creep?</p>', 1, '{\"options\":[\"A deliberate, controlled Agile characteristic where the team responds to change\",\"The uncontrolled expansion of a project\'s requirements beyond its original budget or timeline\",\"A technique used to reduce project risk\",\"I don\'t know\"],\"allowMultiple\":false}'),
(115, 30, 0, 'choice', '<p>What are release notes?</p>', 1, '{\"options\":[\"A private log only developers are allowed to see\",\"A written record of all changes in a new version of a software product\",\"A contract between a client and a software company\",\"I don\'t know\"],\"allowMultiple\":false}'),
(116, 30, 1, 'choice', '<p>Which of the following are among the six principal sections of release notes covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Version number\",\"New features \\/ improvements\",\"Bug fixes\",\"Known issues\"],\"allowMultiple\":true}'),
(117, 30, 2, 'choice', '<p>What is the difference between a bug fix and a known issue in release notes?</p>', 1, '{\"options\":[\"They mean exactly the same thing\",\"A bug fix describes a problem that has been resolved, a known issue is a problem that is not yet fixed but is disclosed honestly\",\"A bug fix is only for developers, a known issue is only for users\",\"I don\'t know\"],\"allowMultiple\":false}'),
(118, 30, 3, 'text', '<p>Explain why transparency matters when writing release notes, and name one group of people other than end users who might read them.</p>', 1, '[]'),
(119, 31, 0, 'choice', '<p>Which three characteristics make up the productive feedback model covered in this lesson?</p>', 1, '{\"options\":[\"Fast, Short, Positive\",\"Specific, Balanced, Actionable\",\"Formal, Written, Detailed\",\"I don\'t know\"],\"allowMultiple\":false}'),
(120, 31, 1, 'choice', '<p>What does it mean for feedback to be balanced?</p>', 1, '{\"options\":[\"It only points out what needs to be improved\",\"It acknowledges what worked as well as what needs improvement\",\"It gives exactly the same number of positive and negative comments\",\"I don\'t know\"],\"allowMultiple\":false}'),
(121, 31, 2, 'choice', '<p>Which of the following are ways feedback can be sought, as covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Informal verbal feedback\",\"Automated feedback such as code linting tools or CI\\/CD reports\",\"User testing feedback\",\"Ignoring the work entirely until release day\"],\"allowMultiple\":true}'),
(122, 31, 3, 'choice', '<p>Why is feedback valuable for developing communication skills?</p>', 1, '{\"options\":[\"It has no real value, it is just a formality\",\"It helps identify blind spots and closes the gap between what was intended and what was understood\",\"It replaces the need for testing software\",\"I don\'t know\"],\"allowMultiple\":false}'),
(123, 31, 4, 'text', '<p>Give an example of actionable feedback on a piece of writing, explaining what makes it actionable.</p>', 1, '[]'),
(124, 31, 5, 'likert', '<p>How confident do you feel giving specific, balanced and actionable feedback on someone else\'s work?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(125, 32, 0, 'choice', '<p>What is the difference between internal and external communication in a coding team?</p>', 1, '{\"options\":[\"There is no real difference, they mean the same thing\",\"Internal communication happens within the development team, external communication happens between the team and clients or users\",\"Internal communication is always written, external communication is always verbal\",\"I don\'t know\"],\"allowMultiple\":false}'),
(126, 32, 1, 'choice', '<p>What caused the loss of the Mars Climate Orbiter in 1999?</p>', 1, '{\"options\":[\"A software bug in the navigation code\",\"One team used Imperial units and another used metric units, and this was not communicated clearly\",\"A hardware fault in the spacecraft\'s engine\",\"I don\'t know\"],\"allowMultiple\":false}'),
(127, 32, 2, 'choice', '<p>Which of the following are forms of communication used in computing, as covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Verbal communication\",\"Non-verbal communication\",\"Written communication\",\"Release notes\"],\"allowMultiple\":true}'),
(128, 32, 3, 'text', '<p>Explain why good communication matters when maintaining software that other developers will work on later.</p>', 1, '[]'),
(129, 32, 4, 'likert', '<p>How confident do you feel explaining how poor communication can cause problems in a software project?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(130, 33, 0, 'choice', '<p>Which of the following best describes a non-technical audience?</p>', 1, '{\"options\":[\"Other developers, software engineers and system administrators who understand terms like APIs and frameworks\",\"Clients, customers, managers or end users who may not understand technical terms\",\"Anyone who has never used a computer before\",\"I don\'t know\"],\"allowMultiple\":false}'),
(131, 33, 1, 'choice', '<p>Which of the following are elements of active listening? Select all that apply.</p>', 1, '{\"options\":[\"Paying full attention to the speaker\",\"Not interrupting\",\"Asking clarifying questions\",\"Interrupting to correct the speaker as soon as possible\"],\"allowMultiple\":true}'),
(132, 33, 2, 'choice', '<p>When rewriting a technical explanation for a non-technical audience, what should you do?</p>', 1, '{\"options\":[\"Remove important information to make it shorter\",\"Keep the same meaning while removing or explaining technical jargon\",\"Add more technical jargon to sound more professional\",\"I don\'t know\"],\"allowMultiple\":false}'),
(133, 33, 3, 'choice', '<p>Which of the following are common causes of miscommunication in development teams? Select all that apply.</p>', 1, '{\"options\":[\"Unclear requirements\",\"Too much technical jargon\",\"Poor listening\",\"Regularly confirming understanding with the other person\"],\"allowMultiple\":true}'),
(134, 33, 4, 'text', '<p>Give an example of how technical jargon could confuse a client, and explain how you would rephrase it.</p>', 1, '[]'),
(135, 34, 0, 'choice', '<p>What is Continuous Integration (CI)?</p>', 1, '{\"options\":[\"The practice of regularly merging code changes into a shared repository where automated tests and checks run automatically\",\"The practice of writing all code by a single developer to avoid conflicts\",\"The practice of releasing every successful build directly to users\",\"I don\'t know\"],\"allowMultiple\":false}'),
(136, 34, 1, 'choice', '<p>Which of these are things a version control system does? Select all that apply.</p>', 1, '{\"options\":[\"Tracks changes to code\",\"Allows collaboration\",\"Manages merge conflicts\",\"Automatically releases code to live users\"],\"allowMultiple\":true}'),
(137, 34, 2, 'choice', '<p>In a typical CI pipeline, what usually happens immediately after code is committed to the repository?</p>', 1, '{\"options\":[\"The code is automatically released to production\",\"The pipeline triggers automatically and the code is built\",\"A developer manually emails the file to IT\",\"I don\'t know\"],\"allowMultiple\":false}'),
(138, 34, 3, 'choice', '<p>What file format does GitHub Actions typically use to define a workflow, and where is it usually stored?</p>', 1, '{\"options\":[\"JSON, stored in the root folder\",\"YAML, stored in .github\\/workflows\\/\",\"CSV, stored in a database\",\"I don\'t know\"],\"allowMultiple\":false}'),
(139, 34, 4, 'text', '<p>Explain why Continuous Integration improves software quality and collaboration in a team.</p>', 1, '[]'),
(140, 35, 0, 'choice', '<p>What is the key difference between Continuous Delivery and Continuous Deployment?</p>', 1, '{\"options\":[\"There is no difference, they are two names for the same thing\",\"Continuous Delivery has a human decision point before release, Continuous Deployment has none\",\"Continuous Deployment only works for small projects\",\"I don\'t know\"],\"allowMultiple\":false}'),
(141, 35, 1, 'choice', '<p>In the pipeline Developer to Git Push to CI Build to Tests to Staging to Production, where does Continuous Delivery stop?</p>', 1, '{\"options\":[\"At Tests\",\"At Staging\",\"At Production\",\"I don\'t know\"],\"allowMultiple\":false}'),
(142, 35, 2, 'choice', '<p>Which of the following scenarios best describes Continuous Deployment?</p>', 1, '{\"options\":[\"Code merges trigger automatic testing and builds only\",\"Updates are packaged automatically but deployed once a month manually after approval\",\"Every successful commit is immediately and automatically released to customers\",\"I don\'t know\"],\"allowMultiple\":false}'),
(143, 35, 3, 'choice', '<p>Why might a mission-critical organisation, such as a bank or a nuclear power station, choose Continuous Delivery over Continuous Deployment?</p>', 1, '{\"options\":[\"To slow down development for no particular reason\",\"To keep a human approval gate before release, reducing the risk of an automatic release causing serious harm\",\"Because Continuous Deployment is illegal in those industries\",\"I don\'t know\"],\"allowMultiple\":false}'),
(144, 35, 4, 'text', '<p>Explain what a rollback strategy is and why it matters in an automated release system.</p>', 1, '[]'),
(145, 36, 0, 'choice', '<p>What is Test-Driven Development (TDD)?</p>', 1, '{\"options\":[\"A method where tests are written after the code, once it is finished\",\"A method where tests are written before the code, code is written to pass the test, and code is then refactored\",\"A method where testing is skipped to speed up development\",\"I don\'t know\"],\"allowMultiple\":false}'),
(146, 36, 1, 'choice', '<p>In the Red-Green-Refactor cycle, what happens during the Red stage?</p>', 1, '{\"options\":[\"Minimal code is written to pass the test\",\"A failing test is written before any code exists\",\"The code is improved without changing its output\",\"I don\'t know\"],\"allowMultiple\":false}'),
(147, 36, 2, 'choice', '<p>Which of the following are benefits of TDD? Select all that apply.</p>', 1, '{\"options\":[\"Improves reliability\",\"Reduces bugs early\",\"Encourages simple design\",\"Guarantees the project needs no further testing\"],\"allowMultiple\":true}'),
(148, 36, 3, 'text', '<p>Explain what happens during the Refactor stage of TDD, and why the tests must still pass afterwards.</p>', 1, '[]'),
(149, 36, 4, 'likert', '<p>How confident do you feel simulating a full Red-Green-Refactor cycle for a simple feature?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(150, 37, 0, 'choice', '<p>What is a syntax error?</p>', 1, '{\"options\":[\"An error where the program runs without crashing but produces the wrong result\",\"An error caused by code that breaks the rules of the programming language, detected before the program runs\",\"An error that only occurs while the program is running\",\"I don\'t know\"],\"allowMultiple\":false}'),
(151, 37, 1, 'choice', '<p>What is a logic error?</p>', 1, '{\"options\":[\"An error that stops the program from running at all\",\"An error where the program runs without crashing but produces the wrong result because the logic is flawed\",\"An error caused by incorrect punctuation in the code\",\"I don\'t know\"],\"allowMultiple\":false}'),
(152, 37, 2, 'choice', '<p>Which debugging technique involves pausing the program at a specific line so you can inspect variables and step through code?</p>', 1, '{\"options\":[\"Print tracing\",\"Rubber duck debugging\",\"Breakpoint\",\"I don\'t know\"],\"allowMultiple\":false}'),
(153, 37, 3, 'choice', '<p>Which of the following are steps in the six-step debugging process? Select all that apply.</p>', 1, '{\"options\":[\"Reproduce the bug\",\"Read the error message\",\"Isolate the problem\",\"Rewrite the entire program from scratch\"],\"allowMultiple\":true}'),
(154, 37, 4, 'text', '<p>Explain what rubber duck debugging is and why it can help find logic errors.</p>', 1, '[]'),
(155, 38, 0, 'choice', '<p>What does abstraction mean in coding?</p>', 1, '{\"options\":[\"Deleting complexity from a program entirely\",\"Hiding complexity and exposing only what is necessary\",\"Combining every part of a system into one function\",\"I don\'t know\"],\"allowMultiple\":false}'),
(156, 38, 1, 'choice', '<p>In the MVC architecture pattern, what does the Controller do?</p>', 1, '{\"options\":[\"Stores the data and business logic\",\"Displays what the user sees on screen\",\"Handles input and connects the Model and the View\",\"I don\'t know\"],\"allowMultiple\":false}'),
(157, 38, 2, 'choice', '<p>Which of the following are components of MVVM? Select all that apply.</p>', 1, '{\"options\":[\"Model\",\"View\",\"ViewModel\",\"Controller\"],\"allowMultiple\":true}'),
(158, 38, 3, 'text', '<p>Explain how Separation of Concerns relates to the Single Responsibility Principle from an earlier lesson.</p>', 1, '[]'),
(159, 39, 0, 'choice', '<p>Who created the SOLID principles?</p>', 1, '{\"options\":[\"Grace Hopper\",\"Robert C. Martin\",\"Ada Lovelace\",\"I don\'t know\"],\"allowMultiple\":false}'),
(160, 39, 1, 'choice', '<p>What does the Open/Closed Principle state?</p>', 1, '{\"options\":[\"Code should be open for extension but closed for modification\",\"Code should always be open source\",\"A class should never be closed to new developers\",\"I don\'t know\"],\"allowMultiple\":false}'),
(161, 39, 2, 'choice', '<p>Which SOLID principle is broken if a Bird class assumes all birds can fly, and then a Penguin subclass cannot?</p>', 1, '{\"options\":[\"Single Responsibility Principle\",\"Liskov Substitution Principle\",\"Interface Segregation Principle\",\"I don\'t know\"],\"allowMultiple\":false}'),
(162, 39, 3, 'text', '<p>Name all five SOLID principles and what each letter stands for.</p>', 1, '[]'),
(163, 40, 0, 'choice', '<p>Which level of testing checks the smallest testable part of software, tested individually?</p>', 1, '{\"options\":[\"Integration Testing\",\"Unit Testing\",\"System Testing\",\"I don\'t know\"],\"allowMultiple\":false}'),
(164, 40, 1, 'choice', '<p>Which type of testing focuses on function only, without reference to the internal code, and can be carried out by anyone?</p>', 1, '{\"options\":[\"White Box Testing\",\"Black Box Testing\",\"Gray Box Testing\",\"I don\'t know\"],\"allowMultiple\":false}'),
(165, 41, 0, 'choice', '<p>What is technical debt?</p>', 1, '{\"options\":[\"A bug that stops the program from running\",\"The future cost caused by shortcuts taken now\",\"A charge a company pays for using open source software\",\"I don\'t know\"],\"allowMultiple\":false}'),
(166, 41, 1, 'choice', '<p>Which of the following are part of best practice, as covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Maintainability\",\"Readability\",\"Scalability\",\"Low technical debt\"],\"allowMultiple\":true}'),
(167, 41, 2, 'text', '<p>Explain why professional coding standards exist, and give one real-world example of a software failure caused by poor practice.</p>', 1, '[]'),
(168, 42, 0, 'choice', '<p>What does the KISS principle stand for?</p>', 1, '{\"options\":[\"Keep It Short and Simple\",\"Keep It Simple and Straightforward\",\"Keep Instructions Structured and Sequential\",\"I don\'t know\"],\"allowMultiple\":false}'),
(169, 42, 1, 'choice', '<p>Which of the following are causes of complexity in code? Select all that apply.</p>', 1, '{\"options\":[\"Too many nested conditions\",\"Poor variable naming\",\"Excessive abstraction\",\"Clear, meaningful function names\"],\"allowMultiple\":true}'),
(170, 42, 2, 'choice', '<p>What does it mean to refactor code?</p>', 1, '{\"options\":[\"Rewriting code so that it produces a different result\",\"Improving code structure without changing its output\",\"Deleting unused code entirely\",\"I don\'t know\"],\"allowMultiple\":false}'),
(171, 42, 3, 'likert', '<p>How confident do you feel refactoring a piece of complex code to make it simpler?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(172, 43, 0, 'choice', '<p>What does the Single Responsibility Principle (SRP) state?</p>', 1, '{\"options\":[\"A function should do as many jobs as possible to save time\",\"A function or module should do one job and have one reason to change\",\"A function should always be under five lines long\",\"I don\'t know\"],\"allowMultiple\":false}'),
(173, 43, 1, 'choice', '<p>Which of the following are consequences of a function taking on too many responsibilities? Select all that apply.</p>', 1, '{\"options\":[\"Harder to debug\",\"Harder to test\",\"Harder to reuse\",\"Easier to maintain\"],\"allowMultiple\":true}'),
(174, 43, 2, 'text', '<p>Explain how splitting a function into single-responsibility functions makes unit testing easier.</p>', 1, '[]'),
(175, 44, 0, 'choice', '<p>Which of the following best describes compiled code?</p>', 1, '{\"options\":[\"Source code translated line by line while the program runs\",\"Source code translated before execution into machine code by a compiler, producing a standalone executable file\",\"Code that only runs inside a web browser\",\"I don\'t know\"],\"allowMultiple\":false}'),
(176, 44, 1, 'choice', '<p>Which of these are stages in the compilation process? Select all that apply.</p>', 1, '{\"options\":[\"Preprocessor\",\"Compiler\",\"Assembler\",\"Linker\"],\"allowMultiple\":true}'),
(177, 44, 2, 'choice', '<p>Which of the following are compiled programming languages? Select all that apply.</p>', 1, '{\"options\":[\"C\",\"C++\",\"Rust\",\"Python\"],\"allowMultiple\":true}'),
(178, 44, 3, 'text', '<p>Explain one advantage of compiled code, using correct terminology such as compiler, machine code and executable.</p>', 1, '[]'),
(179, 45, 0, 'choice', '<p>Which of the following best describes interpreted code?</p>', 1, '{\"options\":[\"Source code translated once into a standalone executable before it runs\",\"Source code executed line by line at runtime by an interpreter, without being translated into a standalone executable first\",\"Code that cannot contain errors\",\"I don\'t know\"],\"allowMultiple\":false}'),
(180, 45, 1, 'choice', '<p>Why can an interpreted program partially run before an error stops it?</p>', 1, '{\"options\":[\"Because all lines are checked for errors before the program starts\",\"Because the interpreter reads and executes one line at a time, so earlier lines can run successfully before a later line causes an error\",\"Because interpreted languages cannot detect errors at all\",\"I don\'t know\"],\"allowMultiple\":false}'),
(181, 45, 2, 'choice', '<p>Which of the following are interpreted languages? Select all that apply.</p>', 1, '{\"options\":[\"Python\",\"JavaScript\",\"C++\",\"Rust\"],\"allowMultiple\":true}'),
(182, 45, 3, 'likert', '<p>How confident do you feel explaining the difference between compiled and interpreted code?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(183, 46, 0, 'choice', '<p>Which of the following best defines a pure function?</p>', 1, '{\"options\":[\"A function that always produces the same output for the same input and has no side effects\",\"A function that changes a global variable every time it is called\",\"A function that reads from a file each time it runs\",\"I don\'t know\"],\"allowMultiple\":false}'),
(184, 46, 1, 'choice', '<p>Which of the following are examples of side effects that would make a function impure? Select all that apply.</p>', 1, '{\"options\":[\"Changing a variable outside itself\",\"Printing to the screen\",\"Writing to a file\",\"Adding together two parameters and returning the result\"],\"allowMultiple\":true}'),
(185, 47, 0, 'choice', '<p>In functional coding, what does stateless mean?</p>', 1, '{\"options\":[\"A function that does nothing with data\",\"A function that does not remember anything about previous runs, each call is independent\",\"A function that has no input or output\",\"I don\'t know\"],\"allowMultiple\":false}'),
(186, 47, 1, 'choice', '<p>Which of these are defining features of functional coding? Select all that apply.</p>', 1, '{\"options\":[\"Uses functions as building blocks\",\"Each function takes input and produces output\",\"Does not remember previous runs\",\"Follows a fixed step-by-step sequence with no functions\"],\"allowMultiple\":true}'),
(187, 47, 2, 'text', '<p>Give a real-world example of a stateless process, and explain why remembering past actions would cause problems for it.</p>', 1, '[]'),
(188, 48, 0, 'choice', '<p>In object-oriented coding, what is a class?</p>', 1, '{\"options\":[\"A specific instance holding real values\",\"A blueprint or template that defines what attributes and methods its objects will have\",\"A single action that an object can perform\",\"I don\'t know\"],\"allowMultiple\":false}'),
(189, 48, 1, 'choice', '<p>Which of the following would normally be an attribute (rather than a method) of a Car class?</p>', 1, '{\"options\":[\"Start engine\",\"Open door\",\"Colour\",\"I don\'t know\"],\"allowMultiple\":false}'),
(190, 48, 2, 'choice', '<p>What is the difference between a class and an object?</p>', 1, '{\"options\":[\"There is no difference, the terms are interchangeable\",\"A class is the blueprint, an object is one specific instance created from that class\",\"An object is the blueprint, a class is one specific instance created from that object\",\"I don\'t know\"],\"allowMultiple\":false}'),
(191, 48, 3, 'text', '<p>Choose a real-world object of your own and list at least three attributes and three methods it would have.</p>', 1, '[]'),
(192, 49, 0, 'choice', '<p>What is procedural coding?</p>', 1, '{\"options\":[\"A completely separate paradigm unrelated to imperative coding\",\"A type of imperative coding that organises instructions into named procedures, followed in a clear sequence\",\"A paradigm where the program only reacts to events\",\"I don\'t know\"],\"allowMultiple\":false}');
INSERT INTO `firstclassquiz_questions` (`id`, `set_id`, `sort_order`, `type`, `prompt`, `required`, `config`) VALUES
(193, 49, 1, 'choice', '<p>Which of the following are examples of events that could trigger an action in event-driven code? Select all that apply.</p>', 1, '{\"options\":[\"A button click\",\"Keyboard input\",\"A sensor trigger\",\"A procedure called at the very start of the program in a fixed sequence\"],\"allowMultiple\":true}'),
(194, 49, 2, 'choice', '<p>What is a multi-paradigm language?</p>', 1, '{\"options\":[\"A language that can only be used for one specific type of program\",\"A language that supports more than one coding paradigm or approach\",\"A language that has no defined paradigm at all\",\"I don\'t know\"],\"allowMultiple\":false}'),
(195, 50, 0, 'choice', '<p>What is the Software Development Lifecycle (SDLC)?</p>', 1, '{\"options\":[\"A type of programming language used to build web applications\",\"A structured process software teams use to plan, build, test, and release software\",\"A set of rules for writing Python code\",\"I don\'t know\"],\"allowMultiple\":false}'),
(196, 50, 1, 'choice', '<p>In the correct SDLC order, which stage comes AFTER implementation (coding)?</p>', 1, '{\"options\":[\"Requirements\",\"Design\",\"Testing\",\"I don\'t know\"],\"allowMultiple\":false}'),
(197, 50, 2, 'choice', '<p>Why does poor requirements gathering in Stage 1 affect all later stages?</p>', 1, '{\"options\":[\"Because the code will contain more syntax errors\",\"Because developers may build the wrong system, solving a problem that was never correctly defined\",\"Because testing tools only work on well-documented systems\",\"I don\'t know\"],\"allowMultiple\":false}'),
(198, 50, 3, 'text', '<p>List the six stages of the SDLC in order, using the mnemonic to help you remember them.</p>', 1, '[]'),
(199, 51, 0, 'choice', '<p>What does a user story describe?</p>', 1, '{\"options\":[\"A technical specification of a database table\",\"A short sentence describing what a user will do with the system: As a user, I want to action so that benefit\",\"A test plan for a specific feature\",\"I don\'t know\"],\"allowMultiple\":false}'),
(200, 51, 1, 'choice', '<p>In the project management triangle, what are the three constraints?</p>', 1, '{\"options\":[\"Planning, Testing, Deployment\",\"Scope, Time, and Cost\",\"Requirements, Design, and Code\",\"I don\'t know\"],\"allowMultiple\":false}'),
(201, 51, 2, 'choice', '<p>In MoSCoW prioritisation, what does the W stand for?</p>', 1, '{\"options\":[\"Would have\",\"Will have later\",\"Won\'t have (in this version)\",\"I don\'t know\"],\"allowMultiple\":false}'),
(202, 51, 3, 'text', '<p>Explain what scope creep is and suggest one way a project team could prevent it.</p>', 1, '[]'),
(203, 52, 0, 'choice', '<p>Which testing approach involves testing inputs and outputs WITHOUT looking at the internal source code?</p>', 1, '{\"options\":[\"White box testing\",\"Grey box testing\",\"Black box testing\",\"I don\'t know\"],\"allowMultiple\":false}'),
(204, 52, 1, 'choice', '<p>What is smoke testing in software development?</p>', 1, '{\"options\":[\"Testing the physical hardware components for overheating\",\"A preliminary test to check whether the core functions work at all before more detailed testing begins\",\"A final acceptance test run by end users before release\",\"I don\'t know\"],\"allowMultiple\":false}'),
(205, 52, 2, 'likert', '<p>How confident do you feel explaining the difference between unit, integration, system and acceptance testing?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(206, 53, 0, 'choice', '<p>What is the Software Development Lifecycle (SDLC)?</p>', 1, '{\"options\":[\"A type of programming language used to build web applications\",\"A structured process software teams use to plan, build, test, and release software\",\"A set of rules for writing Python code\",\"I don\'t know\"],\"allowMultiple\":false}'),
(207, 53, 1, 'choice', '<p>In the correct SDLC order, which stage comes AFTER implementation (coding)?</p>', 1, '{\"options\":[\"Requirements\",\"Design\",\"Testing\",\"I don\'t know\"],\"allowMultiple\":false}'),
(208, 53, 2, 'choice', '<p>Why does poor requirements gathering in Stage 1 affect all later stages?</p>', 1, '{\"options\":[\"Because the code will contain more syntax errors\",\"Because developers may build the wrong system, solving a problem that was never correctly defined\",\"Because testing tools only work on well-documented systems\",\"I don\'t know\"],\"allowMultiple\":false}'),
(209, 53, 3, 'text', '<p>List the six stages of the SDLC in order, using the mnemonic to help you remember them.</p>', 1, '[]'),
(210, 54, 0, 'choice', '<p>What does a user story describe?</p>', 1, '{\"options\":[\"A technical specification of a database table\",\"A short sentence describing what a user will do with the system: As a user, I want to action so that benefit\",\"A test plan for a specific feature\",\"I don\'t know\"],\"allowMultiple\":false}'),
(211, 54, 1, 'choice', '<p>In the project management triangle, what are the three constraints?</p>', 1, '{\"options\":[\"Planning, Testing, Deployment\",\"Scope, Time, and Cost\",\"Requirements, Design, and Code\",\"I don\'t know\"],\"allowMultiple\":false}'),
(212, 54, 2, 'choice', '<p>In MoSCoW prioritisation, what does the W stand for?</p>', 1, '{\"options\":[\"Would have\",\"Will have later\",\"Won\'t have (in this version)\",\"I don\'t know\"],\"allowMultiple\":false}'),
(213, 54, 3, 'text', '<p>Explain what scope creep is and suggest one way a project team could prevent it.</p>', 1, '[]'),
(214, 55, 0, 'choice', '<p>Which testing approach involves testing inputs and outputs WITHOUT looking at the internal source code?</p>', 1, '{\"options\":[\"White box testing\",\"Grey box testing\",\"Black box testing\",\"I don\'t know\"],\"allowMultiple\":false}'),
(215, 55, 1, 'choice', '<p>What is smoke testing in software development?</p>', 1, '{\"options\":[\"Testing the physical hardware components for overheating\",\"A preliminary test to check whether the core functions work at all before more detailed testing begins\",\"A final acceptance test run by end users before release\",\"I don\'t know\"],\"allowMultiple\":false}'),
(216, 55, 2, 'likert', '<p>How confident do you feel explaining the difference between unit, integration, system and acceptance testing?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(217, 56, 0, 'choice', '<p>Which of the following best defines the term coding?</p>', 1, '{\"options\":[\"Designing the physical hardware inside a computer\",\"Writing instructions in a language a computer can understand and execute\",\"Connecting computers together in a network\",\"I don\'t know\"],\"allowMultiple\":false}'),
(218, 56, 1, 'choice', '<p>A microwave, a smart speaker, and a modern car all have something in common. What is it?</p>', 1, '{\"options\":[\"They all connect to the internet\",\"They all contain embedded systems running code\",\"They were all designed by the same company\",\"I don\'t know\"],\"allowMultiple\":false}'),
(219, 56, 2, 'text', '<p>Name three technologies that use code, including at least one that might surprise people.</p>', 1, '[]'),
(220, 57, 0, 'choice', '<p>Which of the following best describes a high-level programming language?</p>', 1, '{\"options\":[\"A language written entirely in binary (0s and 1s)\",\"A language close to human-readable English that requires a translator before the computer can run it\",\"A language used only for operating systems\",\"I don\'t know\"],\"allowMultiple\":false}'),
(221, 57, 1, 'choice', '<p>What does a compiler do?</p>', 1, '{\"options\":[\"Translates code line by line as it runs\",\"Converts assembly language into machine code one instruction at a time\",\"Translates the entire program into machine code before it runs\",\"I don\'t know\"],\"allowMultiple\":false}'),
(222, 57, 2, 'choice', '<p>Which of the following are examples of interpreted languages? Select all that apply.</p>', 1, '{\"options\":[\"Python\",\"JavaScript\",\"C++\",\"Assembly\"],\"allowMultiple\":true}'),
(223, 57, 3, 'likert', '<p>How confident do you feel explaining the difference between a compiler and an interpreter?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(224, 58, 0, 'choice', '<p>Which programming paradigm organises code as a sequence of functions that operate on data?</p>', 1, '{\"options\":[\"Object-Oriented Programming\",\"Procedural programming\",\"Functional programming\",\"I don\'t know\"],\"allowMultiple\":false}'),
(225, 58, 1, 'choice', '<p>In OOP, what is a class?</p>', 1, '{\"options\":[\"A type of loop structure\",\"A blueprint for creating objects, defining their properties and methods\",\"A function that returns a value\",\"I don\'t know\"],\"allowMultiple\":false}'),
(226, 58, 2, 'text', '<p>Name the four syntax rules covered for Python and give an example of what goes wrong if one is broken.</p>', 1, '[]'),
(227, 59, 0, 'choice', '<p>Which operator is used in Python to <strong>CHECK</strong> if two values are equal, rather than to assign a value?</p>', 1, '{\"options\":[\"=\",\"==\",\"!=\",\"I don\'t know\"],\"allowMultiple\":false}'),
(228, 59, 1, 'choice', '<p>What does <code>elif</code> mean in Python?</p>', 1, '{\"options\":[\"End loop if\",\"Else if - adds an additional condition when there are more than two possible outcomes\",\"Execute line if - runs a specific line of code\",\"I don\'t know\"],\"allowMultiple\":false}'),
(229, 59, 2, 'choice', '<p>What is the result of<code> 7 % 2 </code>in Python?</p>', 1, '{\"options\":[\"3.5\",\"0\",\"1\",\"I don\'t know\"],\"allowMultiple\":false}'),
(230, 59, 3, 'choice', '<p>In a Python if/elif/else block, what happens if none of the if or elif conditions are True?</p>', 1, '{\"options\":[\"The program crashes\",\"The else block runs\",\"The if block runs again from the start\",\"I don\'t know\"],\"allowMultiple\":false}'),
(231, 59, 4, 'choice', '<p>Which of these are among the six logical operators used in Python? Select all that apply.</p>', 1, '{\"options\":[\"==\",\"!=\",\">=\",\":=\"],\"allowMultiple\":true}'),
(232, 59, 5, 'text', '<p>Explain in your own words the difference between = and == in Python.</p>', 1, '[]'),
(233, 60, 0, 'choice', '<p>What does the term iteration mean in programming?</p>', 1, '{\"options\":[\"Declaring a new variable\",\"Repeating a block of code\",\"Checking a condition\",\"I don\'t know\"],\"allowMultiple\":false}'),
(234, 60, 1, 'choice', '<p>In Python, what values does range(5) produce?</p>', 1, '{\"options\":[\"1, 2, 3, 4, 5\",\"0, 1, 2, 3, 4\",\"0, 1, 2, 3, 4, 5\",\"I don\'t know\"],\"allowMultiple\":false}'),
(235, 60, 2, 'choice', '<p>Which type of loop would be most appropriate for asking a user for a password until they get it right?</p>', 1, '{\"options\":[\"A for loop, because we know how many attempts there will be\",\"A while loop, because the number of attempts is unknown\",\"Neither, Python cannot handle this\",\"I don\'t know\"],\"allowMultiple\":false}'),
(236, 60, 3, 'likert', '<p>How confident do you feel choosing between a for loop and a while loop for a new problem?</p>', 1, '{\"points\":5,\"labels\":[\"Not at all confident\",\"Slightly confident\",\"Somewhat confident\",\"Confident\",\"Very confident\"]}'),
(237, 61, 0, 'choice', '<p>Which of the following are the four types of physical computer covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Personal computers\",\"Mobile devices\",\"Servers\",\"Embedded devices\"],\"allowMultiple\":true}'),
(238, 61, 1, 'choice', '<p>What is the key difference between a mobile device and a standard personal computer?</p>', 1, '{\"options\":[\"Mobile devices are a fundamentally different class of machine\",\"Mobile devices are personal computers in a different form factor, differing mainly in size, battery life and input method\",\"Mobile devices cannot run an operating system\",\"I don\'t know\"],\"allowMultiple\":false}'),
(239, 61, 2, 'choice', '<p>What defines a server, as covered in this lesson?</p>', 1, '{\"options\":[\"Its physical size\",\"Its role: dedicated to serving resources such as files, web pages or data over a network\",\"The brand of the machine\",\"I don\'t know\"],\"allowMultiple\":false}'),
(240, 61, 3, 'choice', '<p>Why do students sometimes wrongly write \'laptop\' under the server category?</p>', 1, '{\"options\":[\"Because a laptop can never act as a server\",\"Because they forget that a server is defined by its role, not its form factor\",\"Because laptops do not have an operating system\",\"I don\'t know\"],\"allowMultiple\":false}'),
(241, 61, 4, 'choice', '<p>What is a thin client?</p>', 1, '{\"options\":[\"A high-specification workstation used for creative work\",\"A low-powered computer that relies on a remote server for processing\",\"A type of embedded device found in appliances\",\"I don\'t know\"],\"allowMultiple\":false}'),
(242, 62, 0, 'choice', '<p>Which of the following are the four key specifications of a processor covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Cores\",\"Clock speed\",\"Cache\",\"Screen resolution\"],\"allowMultiple\":true}'),
(243, 62, 1, 'choice', '<p>What is the key difference between RAM and ROM?</p>', 1, '{\"options\":[\"RAM is non-volatile and permanent; ROM is volatile and temporary\",\"RAM is volatile and stores running programs; ROM is non-volatile and stores firmware such as the BIOS\",\"There is no real difference, the terms are interchangeable\",\"I don\'t know\"],\"allowMultiple\":false}'),
(244, 62, 2, 'choice', '<p>Which secondary storage type has no moving parts?</p>', 1, '{\"options\":[\"HDD (Hard Disk Drive)\",\"SSD (Solid State Drive)\",\"Optical (CD\\/DVD\\/Blu-ray)\",\"I don\'t know\"],\"allowMultiple\":false}'),
(245, 62, 3, 'choice', '<p>What is the role of the motherboard in a computer system?</p>', 1, '{\"options\":[\"It stores the operating system permanently\",\"It is the main circuit board connecting the CPU, RAM, storage, GPU and NIC\",\"It cools the CPU during heavy use\",\"I don\'t know\"],\"allowMultiple\":false}'),
(246, 62, 4, 'text', '<p>Explain why more CPU cores does not always mean a faster computer for every task.</p>', 1, '[]'),
(247, 63, 0, 'choice', '<p>What is the key difference between a Real-Time OS and a standard Multitasking OS?</p>', 1, '{\"options\":[\"There is no difference, they mean the same thing\",\"A Real-Time OS guarantees a response within a defined time; a Multitasking OS does not\",\"A Multitasking OS is only used in cars and factories\",\"I don\'t know\"],\"allowMultiple\":false}'),
(248, 63, 1, 'choice', '<p>Which of the following are among the six types of utility software covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"File management\",\"Defragmenter\",\"File compression\",\"Word processor\"],\"allowMultiple\":true}'),
(249, 63, 2, 'choice', '<p>Which of the following would normally be handled by the operating system rather than an application?</p>', 1, '{\"options\":[\"Checking your spelling in a document\",\"Deciding which program gets CPU time\",\"Drawing an animated game character on screen\",\"Formatting a paragraph of text\"],\"allowMultiple\":false}'),
(250, 63, 3, 'text', '<p>Name the five types of operating system covered in this lesson and give a real-world use case for one of them.</p>', 1, '[]'),
(251, 64, 0, 'choice', '<p>Which protocol is used to send email, as opposed to receiving it?</p>', 1, '{\"options\":[\"IMAP\",\"POP3\",\"SMTP\",\"HTTP\"],\"allowMultiple\":false}'),
(252, 64, 1, 'choice', '<p>Which of the following are among the three key features of an IDE covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Code editing tools such as syntax highlighting\",\"Debugging tools such as breakpoints\",\"Screen\\/UI design tools\",\"Email sending tools\"],\"allowMultiple\":true}'),
(253, 64, 2, 'choice', '<p>What is the key advantage of an interpreter over a compiler?</p>', 1, '{\"options\":[\"It always produces faster-running programs\",\"It allows immediate execution and easier line-by-line debugging without a separate build step\",\"It removes the need for any source code\",\"I don\'t know\"],\"allowMultiple\":false}'),
(254, 64, 3, 'choice', '<p>Which of the following languages is typically compiled to bytecode and then run by a virtual machine, making it a \'both\' case?</p>', 1, '{\"options\":[\"Python\",\"JavaScript\",\"Java\",\"PHP\"],\"allowMultiple\":false}'),
(255, 65, 0, 'choice', '<p>Which SQL keyword removes duplicate rows from a set of results?</p>', 1, '{\"options\":[\"LIMIT\",\"DISTINCT\",\"GROUP BY\",\"WHERE\"],\"allowMultiple\":false}'),
(256, 65, 1, 'choice', '<p>What is a foreign key?</p>', 1, '{\"options\":[\"A unique identifier for each row in its own table\",\"A column that references the primary key of another table, used to link related records\",\"A password used to secure a database\",\"I don\'t know\"],\"allowMultiple\":false}'),
(257, 66, 0, 'choice', '<p>What is the key difference between NAS and SAN?</p>', 1, '{\"options\":[\"NAS is block-level over Fibre Channel; SAN is file-level over Ethernet\",\"NAS is file-level shared storage over Ethernet; SAN is block-level storage, often over Fibre Channel or iSCSI\",\"There is no real difference, they are two names for the same technology\",\"I don\'t know\"],\"allowMultiple\":false}'),
(258, 66, 1, 'choice', '<p>Which of the following are the three RAID techniques covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Striping\",\"Mirroring\",\"Parity\",\"Fragmentation\"],\"allowMultiple\":true}'),
(259, 66, 2, 'choice', '<p>What does RAID 1 (mirroring) do?</p>', 1, '{\"options\":[\"Splits data across disks for speed, with no redundancy\",\"Writes identical copies of data to multiple disks for redundancy\",\"Uses a mathematical checksum to reconstruct lost data\",\"I don\'t know\"],\"allowMultiple\":false}'),
(260, 66, 3, 'choice', '<p>In RAID 5, what is parity used for?</p>', 1, '{\"options\":[\"Encrypting the data for security\",\"Reconstructing lost data if one disk fails, using a mathematical checksum\",\"Doubling the read speed of the array\",\"I don\'t know\"],\"allowMultiple\":false}'),
(261, 66, 4, 'text', '<p>Explain, in your own words, why RAID 5 uses storage more efficiently than RAID 1 for a large data server.</p>', 1, '[]'),
(262, 67, 0, 'choice', '<p>How does RAID 10 (RAID 1+0) combine striping and mirroring?</p>', 1, '{\"options\":[\"It only uses parity, with no mirroring at all\",\"It stripes data across pairs of disks for speed, then mirrors each striped pair for redundancy\",\"It mirrors data first and never stripes it\",\"I don\'t know\"],\"allowMultiple\":false}'),
(263, 67, 1, 'choice', '<p>What is the minimum number of disks required for RAID 10?</p>', 1, '{\"options\":[\"Two\",\"Three\",\"Four\",\"Six\"],\"allowMultiple\":false}'),
(264, 67, 2, 'choice', '<p>Why does RAID 10 recover from a disk failure faster than RAID 5?</p>', 1, '{\"options\":[\"RAID 10 does not need to calculate parity, since recovery uses the mirrored copy directly\",\"RAID 10 automatically buys a replacement disk\",\"RAID 5 does not support recovery at all\",\"I don\'t know\"],\"allowMultiple\":false}'),
(265, 67, 3, 'choice', '<p>Which of the following are the three layers of a SAN\'s architecture, as covered in this lesson? Select all that apply.</p>', 1, '{\"options\":[\"Host layer\",\"Fabric layer\",\"Storage layer\",\"Application layer\"],\"allowMultiple\":true}'),
(266, 67, 4, 'text', '<p>A local college needs high-speed, reliable access to a shared database server used by many staff at once. Recommend NAS or SAN, and a RAID level, with a brief justification.</p>', 1, '[]');

-- --------------------------------------------------------

--
-- Table structure for table `firstclassquiz_question_sets`
--

DROP TABLE IF EXISTS `firstclassquiz_question_sets`;
CREATE TABLE `firstclassquiz_question_sets` (
  `id` int(10) UNSIGNED NOT NULL,
  `quiz_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `firstclassquiz_question_sets`
--

INSERT INTO `firstclassquiz_question_sets` (`id`, `quiz_id`, `title`, `sort_order`) VALUES
(1, 1, 'Getting to know you...', 0),
(4, 9, 'L2 Unit 1 Lesson 2 and 3 Recall', 0),
(5, 10, 'L2 Unit 1 Lesson 2 and 3 Recall', 0),
(6, 11, 'Lesson 9 - Design Considerations and Robust Code', 0),
(7, 11, 'Lesson 10 - Searching and Sorting', 1),
(8, 11, 'Lesson 11 - Testing: Components, Methods and Automation', 2),
(9, 12, 'Lesson 5 - Sequence and Selection', 0),
(10, 12, 'Lesson 6 - Iteration and Loops', 1),
(11, 12, 'Lesson 7 - Functions and Procedures', 2),
(12, 12, 'Lesson 8 - Validation', 3),
(13, 13, 'Lesson 1 - Data Types, Variables and Constants', 0),
(14, 13, 'Lesson 2 - Data Structures', 1),
(15, 13, 'Lesson 3 - Operators', 2),
(16, 13, 'Lesson 4 - Input and Output', 3),
(17, 14, 'Lesson 8 - Search and Sort Algorithms', 0),
(18, 14, 'Lesson 9 - Root Cause Analysis', 1),
(19, 15, 'Lesson 6 - Algorithms and Flowcharts', 0),
(20, 15, 'Lesson 7 - Pseudocode and Written Descriptions', 1),
(21, 16, 'Lesson 3 - Decomposition', 0),
(22, 16, 'Lesson 4 - Pattern Recognition', 1),
(23, 16, 'Lesson 5 - Abstraction', 2),
(24, 17, 'Lesson 1 - Computational Thinking and Top-Down Design', 0),
(25, 17, 'Lesson 2 - Bottom-Up and Modular Design', 1),
(26, 17, 'Lesson 3 - Decomposition', 2),
(27, 18, 'Lesson 5 - Project Planning', 0),
(28, 18, 'Lesson 6 - Lean, Waterfall and the Triple Constraint', 1),
(29, 18, 'Lesson 7 - Agile', 2),
(30, 19, 'Lesson 3 - Release Notes', 0),
(31, 19, 'Lesson 4 - Feedback', 1),
(32, 20, 'Lesson 1 - Communication', 0),
(33, 20, 'Lesson 2 - Choosing the Right Method', 1),
(34, 21, 'Lesson 9 - Continuous Integration', 0),
(35, 21, 'Lesson 10 - Continuous Delivery and Continuous Deployment', 1),
(36, 22, 'Lesson 7 - Test-Driven Development', 0),
(37, 22, 'Lesson 8 - Bugs and Debugging', 1),
(38, 23, 'Lesson 4 - Separation of Concerns and Abstraction', 0),
(39, 23, 'Lesson 5 - SOLID', 1),
(40, 23, 'Lesson 6 - Testing and Why It Matters', 2),
(41, 24, 'Lesson 1 - Coding Standards', 0),
(42, 24, 'Lesson 2 - KISS', 1),
(43, 24, 'Lesson 3 - Single Responsibility Principle', 2),
(44, 25, 'Lesson 8 - Compiled Code', 0),
(45, 25, 'Lesson 9 - Interpreted Code', 1),
(46, 25, 'Lesson 10 - Pure and Impure Functions', 2),
(47, 26, 'Lesson 4 - Functional Coding', 0),
(48, 26, 'Lesson 5 - Object-Oriented Coding', 1),
(49, 26, 'Lesson 6 - Other Coding Types', 2),
(50, 27, 'Lesson 7 - The Software Development Lifecycle', 0),
(51, 27, 'Lesson 8 - Planning a Software Project', 1),
(52, 27, 'Lesson 9 - Software Testing', 2),
(53, 28, 'Lesson 7 - The Software Development Lifecycle', 0),
(54, 28, 'Lesson 8 - Planning a Software Project', 1),
(55, 28, 'Lesson 9 - Software Testing', 2),
(56, 29, 'Lesson 1 - What is Coding?', 0),
(57, 29, 'Lesson 2 - How Computers Understand Code', 1),
(58, 29, 'Lesson 3 - Syntax and Structure', 2),
(59, 30, 'Lesson 6 - Decisions: Conditional Statements', 0),
(60, 30, 'Lesson 7 - Iterations: for and while Loops', 1),
(61, 31, 'Lesson 1 - Introduction to Digital Environments and Types of Computer', 0),
(62, 31, 'Lesson 2 - Hardware Components', 1),
(63, 32, 'Lesson 3 - Operating Systems and Utilities', 0),
(64, 32, 'Lesson 4 - Application Software, IDEs and Code Development Tools', 1),
(65, 32, 'Lesson 5 - Databases and SQL', 2),
(66, 33, 'Lesson 6 - Resilient Environments: NAS, SAN and RAID 0/1/5', 0),
(67, 33, 'Lesson 7 - Resilient Environments: RAID 10, NAS and SAN Deep Dive', 1);

-- --------------------------------------------------------

--
-- Table structure for table `firstclassquiz_quizzes`
--

DROP TABLE IF EXISTS `firstclassquiz_quizzes`;
CREATE TABLE `firstclassquiz_quizzes` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `public_token` char(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `firstclassquiz_quizzes`
--

INSERT INTO `firstclassquiz_quizzes` (`id`, `title`, `description`, `public_token`, `is_active`, `created_by`, `created_at`) VALUES
(1, 'Welcome', NULL, 'A5LZQR', 1, 1, '2026-07-30 10:12:37'),
(9, 'L2 Unit 1 Lesson 2 and 3 Recall', NULL, 'GE7FNS', 1, 1, '2026-07-30 15:20:48'),
(10, 'L2 Unit 1 Lessons 4 and 5 Recall', NULL, 'KK3B98', 1, 1, '2026-07-30 15:21:38'),
(11, 'DSD Programming Lessons 9 - 11', NULL, 'C7EX5D', 1, 1, '2026-07-31 06:42:13'),
(12, 'DSD Programming Lessons 5 - 8', NULL, 'RDJAQF', 1, 1, '2026-07-31 06:42:13'),
(13, 'DSD Programming Lessons 1 - 4', NULL, 'WWG2LT', 1, 1, '2026-07-31 06:42:13'),
(14, 'DSD Problem Solving Lessons 8 - 9', NULL, 'MP93VV', 1, 1, '2026-07-31 06:42:13'),
(15, 'DSD Problem Solving Lessons 6 - 7', NULL, '5HZ4Q6', 1, 1, '2026-07-31 06:42:13'),
(16, 'DSD Problem Solving Lessons 3 - 6', NULL, '6PRR3B', 1, 1, '2026-07-31 06:42:13'),
(17, 'DSD Problem Solving Lessons 1 - 3', NULL, '36BWMR', 1, 1, '2026-07-31 06:42:13'),
(18, 'L2 Unit 5 Lessons 5 - 7', NULL, 'STZXWB', 1, 1, '2026-07-31 06:42:13'),
(19, 'L2 Unit 5 Lessons 3 - 4', NULL, 'KDY2SU', 1, 1, '2026-07-31 06:42:13'),
(20, 'L2 Unit 5 Lessons 1 - 2', NULL, 'ED7VDT', 1, 1, '2026-07-31 06:42:13'),
(21, 'L2 Unit 4 Lessons 9 - 10', NULL, 'TSKCA2', 1, 1, '2026-07-31 06:42:13'),
(22, 'L2 Unit 4 Lessons 7 - 8', NULL, 'AC5CGN', 1, 1, '2026-07-31 06:42:13'),
(23, 'L2 Unit 4 Lessons 4 - 6', NULL, 'S8PBFQ', 1, 1, '2026-07-31 06:42:13'),
(24, 'L2 Unit 4 Lessons 1 - 3', NULL, 'D83KDB', 1, 1, '2026-07-31 06:42:13'),
(25, 'L2 Unit 3 Lessons 8 - 10', NULL, '9A9YQ8', 1, 1, '2026-07-31 06:42:13'),
(26, 'L2 Unit 3 Lessons 4 - 6', NULL, 'REE2EL', 1, 1, '2026-07-31 06:42:13'),
(27, 'L2 Unit 3 Lessons 1 - 3', NULL, 'C2Y29Z', 1, 1, '2026-07-31 06:42:13'),
(28, 'L2 Unit 2 Lessons 4 - 9', NULL, 'JCAYCU', 1, 1, '2026-07-31 06:42:13'),
(29, 'L2 Unit 2 Lessons 1 - 3', NULL, 'M7AQDV', 1, 1, '2026-07-31 06:42:13'),
(30, 'L2 Unit 1 Lesson 6 and 7 Recall', NULL, 'LFMVZM', 1, 1, '2026-07-31 06:42:13'),
(31, 'DSD Digital Environments Lessons 1 - 2', NULL, 'KHN8JV', 1, 1, '2026-07-31 08:19:42'),
(32, 'DSD Digital Environments Lessons 3 - 5', NULL, 'U5Q9M3', 1, 1, '2026-07-31 08:21:52'),
(33, 'DSD Digital Environments Lessons 6 - 7', NULL, 'K4JFXQ', 1, 1, '2026-07-31 08:23:28');

-- --------------------------------------------------------

--
-- Table structure for table `firstclassquiz_responses`
--

DROP TABLE IF EXISTS `firstclassquiz_responses`;
CREATE TABLE `firstclassquiz_responses` (
  `id` int(10) UNSIGNED NOT NULL,
  `submission_id` int(10) UNSIGNED NOT NULL,
  `question_id` int(10) UNSIGNED NOT NULL,
  `answer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `firstclassquiz_submissions`
--

DROP TABLE IF EXISTS `firstclassquiz_submissions`;
CREATE TABLE `firstclassquiz_submissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `quiz_id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `college_email` varchar(255) NOT NULL,
  `submitted_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `firstclassquiz_admins`
--
ALTER TABLE `firstclassquiz_admins`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `username` (`username`) USING BTREE;

--
-- Indexes for table `firstclassquiz_questions`
--
ALTER TABLE `firstclassquiz_questions`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_questions_set` (`set_id`) USING BTREE;

--
-- Indexes for table `firstclassquiz_question_sets`
--
ALTER TABLE `firstclassquiz_question_sets`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_sets_quiz` (`quiz_id`) USING BTREE;

--
-- Indexes for table `firstclassquiz_quizzes`
--
ALTER TABLE `firstclassquiz_quizzes`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `public_token` (`public_token`) USING BTREE,
  ADD KEY `fk_quizzes_admin` (`created_by`) USING BTREE;

--
-- Indexes for table `firstclassquiz_responses`
--
ALTER TABLE `firstclassquiz_responses`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_responses_submission` (`submission_id`) USING BTREE,
  ADD KEY `fk_responses_question` (`question_id`) USING BTREE;

--
-- Indexes for table `firstclassquiz_submissions`
--
ALTER TABLE `firstclassquiz_submissions`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_submissions_quiz` (`quiz_id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `firstclassquiz_admins`
--
ALTER TABLE `firstclassquiz_admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `firstclassquiz_questions`
--
ALTER TABLE `firstclassquiz_questions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=267;

--
-- AUTO_INCREMENT for table `firstclassquiz_question_sets`
--
ALTER TABLE `firstclassquiz_question_sets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `firstclassquiz_quizzes`
--
ALTER TABLE `firstclassquiz_quizzes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `firstclassquiz_responses`
--
ALTER TABLE `firstclassquiz_responses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `firstclassquiz_submissions`
--
ALTER TABLE `firstclassquiz_submissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `firstclassquiz_questions`
--
ALTER TABLE `firstclassquiz_questions`
  ADD CONSTRAINT `fk_questions_set` FOREIGN KEY (`set_id`) REFERENCES `firstclassquiz_question_sets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `firstclassquiz_question_sets`
--
ALTER TABLE `firstclassquiz_question_sets`
  ADD CONSTRAINT `fk_sets_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `firstclassquiz_quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `firstclassquiz_quizzes`
--
ALTER TABLE `firstclassquiz_quizzes`
  ADD CONSTRAINT `fk_quizzes_admin` FOREIGN KEY (`created_by`) REFERENCES `firstclassquiz_admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `firstclassquiz_responses`
--
ALTER TABLE `firstclassquiz_responses`
  ADD CONSTRAINT `fk_responses_question` FOREIGN KEY (`question_id`) REFERENCES `firstclassquiz_questions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_responses_submission` FOREIGN KEY (`submission_id`) REFERENCES `firstclassquiz_submissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `firstclassquiz_submissions`
--
ALTER TABLE `firstclassquiz_submissions`
  ADD CONSTRAINT `fk_submissions_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `firstclassquiz_quizzes` (`id`) ON DELETE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
