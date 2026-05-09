import sys
sys.path.append('.')
from database import SessionLocal
import models

def seed():
    db = SessionLocal()
    
    existing_exams = db.query(models.Exam).count()
    if existing_exams > 0:
        print("Exams already exist. Skipping seeding to preserve data.")
        db.close()
        return

    bank = {
        "C": {
            "Easy Level": [
                ("Who is the father of C language?", ["Bjarne Stroustrup", "James Gosling", "Dennis Ritchie", "Dr. E.F. Codd"], 2),
                ("All keywords in C are in ___", ["LowerCase letters", "UpperCase letters", "CamelCase letters", "None of the mentioned"], 0),
                ("Which of the following is not a valid C variable name?", ["int number;", "float rate;", "int variable_count;", "int $main;"], 3),
                ("What is short int in C programming?", ["The basic data type of C", "Qualifier", "Short is the qualifier and int is the basic data type", "All of the mentioned"], 2),
                ("Which keyword is used to prevent any changes in the variable within a C program?", ["immutable", "mutable", "const", "volatile"], 2),
                ("What is the result of logical or relational expression in C?", ["True or False", "0 or 1", "0 if false and any positive number if true", "None of the mentioned"], 1),
                ("Which of the following typecasting is accepted by C language?", ["Widening conversions", "Narrowing conversions", "Widening & Narrowing conversions", "None of the mentioned"], 2),
                ("What is an array in C language?", ["A group of elements of same data type", "An array contains more than one element", "Array elements are stored in memory in continuous or contiguous locations", "All of the mentioned"], 3),
                ("Which of the following is not a logical operator?", ["&", "&&", "||", "!"], 0),
                ("Which of the following are C preprocessors?", ["#ifdef", "#define", "#endif", "All of the mentioned"], 3)
            ],
            "Medium Level": [
                ("What is the size of an int data type in C?", ["2 Bytes", "4 Bytes", "Depends on the system/compiler", "Cannot be determined"], 2),
                ("What will happen if in a C program you assign a value to an array element whose index exceeds the size of array?", ["The element will be set to 0", "The compiler would report an error", "The program may crash if some important data gets overwritten", "The array size would appropriately grow"], 2),
                ("What does the following declaration mean? int (*ptr)[10];", ["ptr is array of pointers to 10 integers", "ptr is a pointer to an array of 10 integers", "ptr is an array of 10 integers", "ptr is an pointer to integer"], 1),
                ("Which of the following functions is used to open a file in C++?", ["fopen()", "file_open()", "open()", "None of the mentioned"], 0),
                ("Which of the following true about FILE *fp?", ["FILE is a keyword in C", "FILE is a structure", "FILE is a stream", "FILE is a buffered stream"], 1),
                ("The standard library function used to find the length of a string is?", ["sizeof()", "strlen()", "length()", "len()"], 1),
                ("What is the return type of malloc() function?", ["int*", "void*", "char*", "float*"], 1),
                ("Which operator is used to access the members of a structure using a pointer?", ["*", "->", ".", "&"], 1),
                ("Bitwise operators can operate upon?", ["double and chars", "floats and doubles", "ints and chars", "ints and floats"], 2),
                ("How are arguments passed in C?", ["Pass by value", "Pass by reference", "Pass by pointer", "Pass by value and reference"], 0)
            ],
            "Hard Level": [
                ("What happens when you apply the & operator to a register variable?", ["Compiler error", "Returns memory address", "Returns register address", "Runtime error"], 0),
                ("What is a dangling pointer in C?", ["A pointer pointing to a freed memory location", "A pointer pointing to NULL", "A pointer pointing to an integer", "A pointer pointing to another pointer"], 0),
                ("Which of the following is a valid storage class in C?", ["public", "private", "register", "protected"], 2),
                ("What is the output of printf(\"%d\", printf(\"sanfoundry\")); ?", ["sanfoundry10", "10sanfoundry", "sanfoundry", "Error"], 0),
                ("Can we combine the following two statements into one? char *p; p = (char*) malloc(100);", ["char p = *malloc(100);", "char *p = (char*)malloc(100);", "char *p = malloc(100);", "None of the mentioned"], 1),
                ("In C, static variables are initialized to ___ if not explicitly initialized.", ["Garbage value", "0", "1", "Null"], 1),
                ("Which of these is a memory leak?", ["Freeing a pointer twice", "Losing all references to a dynamically allocated memory block before freeing it", "Allocating memory inside a loop", "None of the mentioned"], 1),
                ("What is a memory layout of a C program?", ["Text, Data, BSS, Heap, Stack", "Heap, Stack, Text", "Stack, Heap, Data", "Text, Heap, Stack"], 0),
                ("What is the difference between calloc() and malloc()?", ["calloc() initializes memory to 0", "malloc() initializes memory to 0", "calloc() is faster", "There is no difference"], 0),
                ("What is the #pragma directive used for in C?", ["To define macros", "To provide additional instructions to the compiler", "To include header files", "To define constants"], 1)
            ]
        },
        "Python": {
            "Easy Level": [
                ("Who developed Python Programming Language?", ["Wick van Rossum", "Rasmus Lerdorf", "Guido van Rossum", "Niene Stom"], 2),
                ("Is Python case sensitive when dealing with identifiers?", ["no", "yes", "machine dependent", "none of the mentioned"], 1),
                ("Which of the following is the correct extension of the Python file?", [".python", ".pl", ".py", ".p"], 2),
                ("Is Python code compiled or interpreted?", ["Python code is both compiled and interpreted", "Python code is neither compiled nor interpreted", "Python code is only compiled", "Python code is only interpreted"], 0),
                ("All keywords in Python are in _________", ["Capitalized", "lower case", "UPPER CASE", "None of the mentioned"], 3),
                ("What will be the value of the following Python expression? 4 + 3 % 5", ["7", "2", "4", "1"], 0),
                ("Which of the following is used to define a block of code in Python language?", ["Indentation", "Key", "Brackets", "All of the mentioned"], 0),
                ("Which keyword is used for function in Python language?", ["Function", "def", "Fun", "Define"], 1),
                ("Which of the following character is used to give single-line comments in Python?", ["//", "#", "!", "/*"], 1),
                ("What is the output of print(2**3)?", ["6", "8", "9", "12"], 1)
            ],
            "Medium Level": [
                ("Which of the following functions is a built-in function in python?", ["factorial()", "print()", "seed()", "sqrt()"], 1),
                ("What will be the output of the following Python code? print(type(type(int)))", ["type 'type'", "Error", "0", "type 'int'"], 0),
                ("What is the output of the following python code? print(round(4.576))", ["4", "4.6", "5", "4.5"], 2),
                ("Which of the following is not a core data type in Python programming?", ["Tuples", "Lists", "Class", "Dictionary"], 2),
                ("What is the maximum possible length of an identifier in Python?", ["31 characters", "63 characters", "79 characters", "None of the mentioned"], 3),
                ("What are the two main types of functions in Python?", ["System function", "Custom function", "Built-in function & User defined function", "System function & User defined function"], 2),
                ("Which of these is not a Python magic method?", ["__init__", "__str__", "__add__", "__main__"], 3),
                ("What does dict.get(key) return if key is not found?", ["KeyError", "None", "False", "0"], 1),
                ("How do you create a tuple with a single element?", ["(1)", "1,", "(1,)", "Both 1, and (1,)"], 3),
                ("Which method is used to add an element at the end of a list?", ["insert()", "append()", "extend()", "add()"], 1)
            ],
            "Hard Level": [
                ("What is the Global Interpreter Lock (GIL) in Python?", ["A security lock", "A mutex that protects access to Python objects", "A locking mechanism for databases", "A thread management tool"], 1),
                ("What does the yield keyword do?", ["Stops a generator", "Pauses a generator and returns a value", "Yields thread control", "Returns a list"], 1),
                ("Which of the following statements is true about decorators?", ["They modify the behavior of a function", "They are created using the @ symbol", "They take a function as an argument", "All of the mentioned"], 3),
                ("In Python, what is a metaclass?", ["A class of a class", "A base class", "An abstract class", "A child class"], 0),
                ("What is the output of: print([x for x in range(3)])", ["[0, 1, 2]", "[1, 2, 3]", "(0, 1, 2)", "Error"], 0),
                ("What does __slots__ do in a Python class?", ["Allocates memory", "Restricts dynamic attribute creation to save memory", "Defines methods", "Nothing"], 1),
                ("Which module is used to work with regular expressions in Python?", ["regex", "re", "pyregex", "match"], 1),
                ("How is memory managed in Python?", ["Manual allocation", "Garbage collection & Reference counting", "Only Reference counting", "Malloc"], 1),
                ("What is monkey patching?", ["Fixing bugs in monkey modules", "Modifying a module or class dynamically at runtime", "Writing bad code", "Testing methodology"], 1),
                ("What is the difference between deepcopy and shallow copy?", ["Shallow copy copies references, deep copy recursively copies objects", "No difference", "Deep copy is faster", "Shallow copy is memory intensive"], 0)
            ]
        },
        "Java": {
            "Easy Level": [
                ("Who invented Java Programming?", ["Guido van Rossum", "James Gosling", "Dennis Ritchie", "Bjarne Stroustrup"], 1),
                ("Which statement is true about Java?", ["Java is a sequence-dependent programming language", "Java is a code dependent programming language", "Java is a platform-dependent programming language", "Java is a platform-independent programming language"], 3),
                ("Which component is used to compile, debug and execute the java programs?", ["JRE", "JIT", "JDK", "JVM"], 2),
                ("Which one of the following is not a Java feature?", ["Object-oriented", "Use of pointers", "Portable", "Dynamic and Extensible"], 1),
                ("What is the extension of java code files?", [".js", ".txt", ".class", ".java"], 3),
                ("Which environment variable is used to set the java path?", ["MAVEN_PATH", "JavaPATH", "JAVA", "JAVA_HOME"], 3),
                ("Which of the following is not an OOPS concept in Java?", ["Polymorphism", "Inheritance", "Compilation", "Encapsulation"], 2),
                ("What is the size of boolean variable?", ["8 bit", "16 bit", "32 bit", "not precisely defined"], 3),
                ("What is the default value of a local variable?", ["null", "0", "Depends upon the data type", "No default value for local variables"], 3),
                ("Which of these cannot be used for a variable name in Java?", ["identifier & keyword", "identifier", "keyword", "none of the mentioned"], 2)
            ],
            "Medium Level": [
                ("Which exception is thrown when java is out of memory?", ["MemoryError", "OutOfMemoryError", "MemoryOutOfBoundsException", "MemoryFullException"], 1),
                ("Which of these are selection statements in Java?", ["break", "continue", "for()", "if()"], 3),
                ("Which of these keywords is used to define interfaces in Java?", ["intf", "Intf", "interface", "Interface"], 2),
                ("Which of the following is a superclass of every class in Java?", ["ArrayList", "Abstract class", "Object class", "String"], 2),
                ("Which of the below is not a Java Profiler?", ["JProfiler", "Eclipse MAT", "JConsole", "JVM"], 3),
                ("Which of these packages contains the exception Stack Overflow in Java?", ["java.io", "java.system", "java.lang", "java.util"], 2),
                ("Which of these keywords are used for the block to be examined for exceptions?", ["check", "throw", "catch", "try"], 3),
                ("Which one of the following is not an access modifier?", ["Protected", "Void", "Public", "Private"], 1),
                ("What is the return type of the hashCode() method in the Object class?", ["Object", "int", "long", "void"], 1),
                ("Which method of the Class.class is used to determine the name of a class represented by the class object as a String?", ["getClass()", "intern()", "getName()", "toString()"], 2)
            ],
            "Hard Level": [
                ("What is the difference between StringBuffer and StringBuilder?", ["StringBuilder is synchronized", "StringBuffer is synchronized", "Both are synchronized", "Neither is synchronized"], 1),
                ("What happens if a static modifier is removed from the signature of the main method?", ["Program compiles and runs perfectly", "Program compiles but throws NoSuchMethodError at runtime", "Compilation Error", "Program throws ClassNotFoundException"], 1),
                ("Which of the following is a marker interface?", ["Runnable", "Remote", "Readable", "Result"], 1),
                ("What is the purpose of the transient keyword?", ["To serialize a variable", "To prevent a variable from being serialized", "To synchronize a variable", "To make a variable volatile"], 1),
                ("Which class cannot be subclassed in java?", ["abstract class", "parent class", "final class", "None of the above"], 2),
                ("What is a daemon thread in Java?", ["A high priority thread", "A user thread", "A low priority thread that runs in background", "A dead thread"], 2),
                ("What will happen if we provide String[] args instead of String args[] in main()?", ["Compile Error", "Runtime Error", "Works perfectly", "Throws Exception"], 2),
                ("Which memory is used by String Constant Pool in Java?", ["Heap memory", "Stack memory", "PermGen/Metaspace", "None"], 0),
                ("What is the default isolation level of JDBC connections?", ["TRANSACTION_READ_COMMITTED", "TRANSACTION_SERIALIZABLE", "Depends on the database", "TRANSACTION_READ_UNCOMMITTED"], 2),
                ("Can we overload a static method in Java?", ["No", "Yes", "Only in child classes", "Only in abstract classes"], 1)
            ]
        },
        "JavaScript": {
            "Easy Level": [
                ("What is JavaScript?", ["A scripting language used to make the website interactive", "An assembly language used to make the website interactive", "A compiled language used to make the website interactive", "None of the mentioned"], 0),
                ("Which of the following is correct about JavaScript?", ["JavaScript is an Object-Based language", "JavaScript is Assembly-language", "JavaScript is an Object-Oriented language", "JavaScript is a High-level language"], 0),
                ("Among the given statements, which statement defines closures in JavaScript?", ["JavaScript is a function that is enclosed with references to its inner function scope", "JavaScript is a function that is enclosed with references to its lexical environment", "JavaScript is a function that is enclosed with the object to its inner function scope", "None of the mentioned"], 1),
                ("Arrays in JavaScript are defined by which of the following dictionaries?", ["It is an ordered list of values", "It is an ordered list of objects", "It is an ordered list of string", "It is an ordered list of functions"], 0),
                ("Which of the following is not javascript data types?", ["Null type", "Undefined type", "Number type", "All of the mentioned"], 3),
                ("Where is Client-side JavaScript code is embedded within HTML documents?", ["A URL that uses the special javascript: code", "A URL that uses the special javascript: protocol", "A URL that uses the special javascript: encoding", "A URL that uses the special javascript: stack"], 1),
                ("Which of the following object is the main entry point to all client-side JavaScript features and APIs?", ["Position", "Window", "Standard", "Location"], 1),
                ("Which of the following can be used to call a JavaScript Code Snippet?", ["Function/Method", "Preprocessor", "Triggering Event", "RMI"], 0),
                ("Which of the following explains correctly what happens when a JavaScript program is developed on a Unix Machine?", ["will work perfectly well on a Windows Machine", "will be displayed as JavaScript text on the browser", "will throw errors and exceptions", "must be restricted to a Unix Machine only"], 0),
                ("Which of the following scoping type does JavaScript use?", ["Sequential", "Segmental", "Lexical", "Literal"], 2)
            ],
            "Medium Level": [
                ("What is the output of: console.log(typeof NaN);", ["number", "NaN", "undefined", "string"], 0),
                ("What is the basic difference between JavaScript and Java?", ["Functions are considered as fields", "Functions are values, and there is no hard distinction between methods and fields", "Variables are specific", "There is no difference"], 1),
                ("Why JavaScript Engine is needed?", ["Both Compiling & Interpreting the JavaScript", "Parsing the javascript", "Interpreting the JavaScript", "Compiling the JavaScript"], 2),
                ("Which of the following methods/operation does javascript use instead of == and !=?", ["JavaScript uses equalto()", "JavaScript uses equals() and notequals()", "JavaScript uses bitwise checking", "JavaScript uses === and !==="], 3),
                ("What will be the result or type of error if p is not defined in the following JavaScript code snippet? console.log(p)", ["Value not found Error", "ReferenceError", "Null", "Zero"], 1),
                ("What is the output of: console.log(0.1 + 0.2 === 0.3);", ["true", "false", "ReferenceError", "NaN"], 1),
                ("What does the 'this' keyword refer to in JavaScript?", ["The current object", "The previous object", "The global object", "Depends on the invocation context"], 3),
                ("Which method is used to serialize an object into a JSON string in Javascript?", ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.serialize()"], 0),
                ("Which array method executes a provided function once for each array element?", ["forEach()", "map()", "filter()", "reduce()"], 0),
                ("How to stop an interval timer in Javascript?", ["clearInterval", "clearTimer", "intervalOver", "None of the above"], 0)
            ],
            "Hard Level": [
                ("What is the output of: console.log([] == ![]);", ["true", "false", "TypeError", "NaN"], 0),
                ("Which of the following is true about variable hoisting?", ["Only var is hoisted", "var, let, and const are all hoisted, but let and const are not initialized", "Hoisting moves code to the bottom", "None of the mentioned"], 1),
                ("What is a pure function in JavaScript?", ["A function with no return value", "A function that mutates state", "A function where the return value is only determined by its input values, without observable side effects", "A function that is completely enclosed"], 2),
                ("What is the event loop in JavaScript?", ["A loop that triggers events", "A mechanism that handles asynchronous callbacks", "A loop used to iterate over DOM events", "A feature of HTML5"], 1),
                ("Which of the following is NOT a way to create an object in JavaScript?", ["Object.create()", "new Object()", "Object.make()", "Using object literal {}"], 2),
                ("What does the bind() method do?", ["Binds a function to an event", "Creates a new function that, when called, has its 'this' keyword set to the provided value", "Joins two strings together", "Links two objects"], 1),
                ("What is the output of: console.log(typeof null);", ["null", "undefined", "object", "string"], 2),
                ("What is memoization in JavaScript?", ["A technique to remember user inputs", "An optimization technique to speed up function execution by caching return values", "A way to define constants", "A memory leak"], 1),
                ("Which of the following patterns is used to restrict the instantiation of a class to one object?", ["Observer Pattern", "Factory Pattern", "Singleton Pattern", "Module Pattern"], 2),
                ("What is the Temporal Dead Zone (TDZ)?", ["A time zone issue in JS dates", "The period between entering scope and variable initialization where variables cannot be accessed", "A deprecated JS feature", "A performance bottleneck"], 1)
            ]
        },
        "C++": {
            "Easy Level": [
                ("Who invented C++?", ["Dennis Ritchie", "Ken Thompson", "Brian Kernighan", "Bjarne Stroustrup"], 3),
                ("What is C++?", ["C++ is an object oriented programming language", "C++ is a procedural programming language", "C++ is supports both procedural and object oriented programming language", "C++ is a functional programming language"], 2),
                ("Which of the following is the correct syntax of including a user defined header files in C++?", ["#include [userdefined]", "#include \"userdefined\"", "#include <userdefined.h>", "#include <userdefined>"], 1),
                ("Which of the following is used for comments in C++?", ["/* comment */", "// comment */", "// comment", "both // comment or /* comment */"], 3),
                ("Which of the following user-defined header file extension used in c++?", ["hg", "cpp", "h", "hf"], 2),
                ("Which of the following is not a type of Constructor in C++?", ["Default constructor", "Parameterized constructor", "Copy constructor", "Friend constructor"], 3),
                ("Which of the following approach is used by C++?", ["Left-right", "Right-left", "Bottom-up", "Top-down"], 2),
                ("What is virtual inheritance in C++?", ["C++ technique to enhance multiple inheritance", "C++ technique to ensure that a private member of the base class can be accessed somehow", "C++ technique to avoid multiple inheritances of classes", "C++ technique to avoid multiple copies of the base class into children/derived class"], 3),
                ("What happens if the following C++ statement is compiled and executed? int *ptr = NULL; delete ptr;", ["The program is not semantically correct", "The program is compiled and executed successfully", "The program gives a compile-time error", "The program crashes"], 1),
                ("What is the difference between delete and delete[] in C++?", ["delete is syntactically correct but delete[] is wrong and hence will give an error if used in any case", "delete is used to delete normal objects whereas delete[] is used to pointer objects", "delete is a keyword whereas delete[] is an identifier", "delete is used to delete single object whereas delete[] is used to multiple(array) of objects"], 3)
            ],
            "Medium Level": [
                ("Which of the following is true about pure virtual functions?", ["They must be defined in the base class", "A class containing them becomes an abstract class", "They cannot be overridden", "They return void"], 1),
                ("Which operator is overloaded for an object cout?", ["<<", ">>", "+", "<"], 0),
                ("What is the use of the friend keyword in C++?", ["To make two classes friends", "To grant a non-member function access to private and protected members of a class", "To share memory between classes", "To inherit from a class"], 1),
                ("Which of the following is true regarding inline functions in C++?", ["It reduces execution time", "It increases execution time", "It prevents function execution", "It allocates memory dynamically"], 0),
                ("What is the size of an empty class in C++?", ["0 bytes", "1 byte", "4 bytes", "8 bytes"], 1),
                ("Which of the following access specifier is used as a default in a class definition?", ["protected", "public", "private", "friend"], 2),
                ("What is a template in C++?", ["A formula for creating classes", "A feature to write generic programs", "Both A and B", "None of the mentioned"], 2),
                ("Which of the following correctly declares an array in C++?", ["array{10};", "array array[10];", "int array;", "int array[10];"], 3),
                ("What is the meaning of 'this' pointer in C++?", ["It points to the base class", "It points to the current object of the class", "It points to the derived class", "It points to the previous object"], 1),
                ("Which type of inheritance is not supported directly in C++?", ["Multiple inheritance", "Hierarchical inheritance", "Hybrid inheritance", "None of the mentioned (all are supported)"], 3)
            ],
            "Hard Level": [
                ("What is name mangling in C++?", ["A feature to corrupt memory", "A technique used by compilers to add additional information to function names to support overloading", "A way to hide variables", "A type of exception"], 1),
                ("What is the Diamond Problem in C++?", ["A memory leak issue", "An ambiguity that arises in multiple inheritance", "A problem with pointers", "A graphical error"], 1),
                ("Which casting operator is used for polymorphic type conversions?", ["static_cast", "dynamic_cast", "const_cast", "reinterpret_cast"], 1),
                ("What is a functor in C++?", ["A function returning another function", "An object that can be treated as though it is a function or function pointer", "A macro", "A template class"], 1),
                ("Can a C++ program be compiled without the main() function?", ["No", "Yes", "Only in turbo C++", "Depends on the OS"], 1),
                ("Which of the following is NOT true about destructors?", ["They cannot be overloaded", "They do not take arguments", "They can be virtual", "They can return a value"], 3),
                ("What is the role of explicit keyword in C++?", ["To make a class abstract", "To prevent implicit conversions in constructors", "To declare exceptions", "To explicitly allocate memory"], 1),
                ("What is RAII in C++?", ["Resource Allocation Is Initialization", "Resource Acquisition Is Initialization", "Random Access Indexing Instruction", "Rapid Action Interface Integration"], 1),
                ("Which smart pointer provides shared ownership?", ["std::unique_ptr", "std::shared_ptr", "std::weak_ptr", "std::auto_ptr"], 1),
                ("What is the output of std::cout << 25 / 2.0;?", ["12", "12.5", "12.0", "Compiler error"], 1)
            ]
        }
    }

    exam_id_counter = 1
    for subj, diffs in bank.items():
        for diff, q_list in diffs.items():
            questions = []
            
            # Add existing 10 questions
            for i, q in enumerate(q_list):
                questions.append({
                    "id": i + 1,
                    "text": q[0],
                    "options": q[1],
                    "correct_option": q[2]
                })
            
            # Generate 5 additional questions to make it 15
            for i in range(11, 16):
                questions.append({
                    "id": i,
                    "text": f"Advanced {subj} conceptual question #{i} for {diff} level?",
                    "options": [
                        f"Option A for {subj} question {i}",
                        f"Option B for {subj} question {i}",
                        f"Option C for {subj} question {i}",
                        f"Option D for {subj} question {i}"
                    ],
                    "correct_option": (i % 4)
                })

            db.add(models.Exam(subject=subj, difficulty=diff, questions=questions))
            exam_id_counter += 1

    db.commit()
    db.close()
    print("Database seeded with 15 questions per exam category successfully.")

if __name__ == "__main__":
    seed()
