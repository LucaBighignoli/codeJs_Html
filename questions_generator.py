import json
import random

def generate_options(correct_answer):
    """
    Generate three fake answer options that are close to the correct answer.
    - If the correct answer is lower than 50, use a fixed bound of ±5 (ensuring no negative values).
    - Otherwise, use a 10% margin.
    The function returns a shuffled list containing three fake answers and the correct answer.
    """
    # Determine bounds based on the value of the correct answer
    if abs(correct_answer) < 50:
        lower_bound = max(0, correct_answer - 5)
        upper_bound = correct_answer + 5
    else:
        margin = max(1, int(0.1 * abs(correct_answer)))
        lower_bound = correct_answer - margin
        upper_bound = correct_answer + margin

    # Create a list of possible fake answers within the bounds, excluding the correct answer
    possible_options = [num for num in range(lower_bound, upper_bound + 1) if num != correct_answer]
    
    # Ensure there are at least 3 distinct possible fake answers
    if len(possible_options) < 3:
        raise ValueError("Not enough numbers in the range to generate fake answers.")
    
    # Randomly sample 3 fake answers
    fake_options = random.sample(possible_options, 3)
    
    # Combine with the correct answer and shuffle the final list
    options = fake_options + [correct_answer]
    random.shuffle(options)
    
    return options


questions = []
id_counter = 1

operations = ["Addition", "Subtraction", "Multiplication", "Division"]
difficulties = ["Easy", "Medium", "Difficult"]

for op in operations:
    for diff in difficulties:
        for i in range(20):  # 20 questions per difficulty level per operation
            if op == "Addition":
                if diff == "Easy":
                    a = random.randint(1, 20)
                    b = random.randint(1, 20)
                    lower, upper = 1, 40
                elif diff == "Medium":
                    a = random.randint(21, 50)
                    b = random.randint(21, 50)
                    lower, upper = 20, 100
                elif diff == "Difficult":
                    a = random.randint(51, 100)
                    b = random.randint(51, 100)
                    lower, upper = 50, 200
                question_text = f"What is {a} + {b}?"
                answer = a + b
                options = generate_options(answer)
            
            elif op == "Subtraction":
                if diff == "Easy":
                    a = random.randint(10, 30)
                    b = random.randint(1, a-1)
                    lower, upper = 1, 30
                elif diff == "Medium":
                    a = random.randint(31, 70)
                    b = random.randint(10, a-1)
                    lower, upper = 10, 70
                elif diff == "Difficult":
                    a = random.randint(71, 150)
                    b = random.randint(30, a-1)
                    lower, upper = 30, 150
                question_text = f"What is {a} - {b}?"
                answer = a - b
                options = generate_options(answer)
            
            elif op == "Multiplication":
                if diff == "Easy":
                    a = random.randint(2, 6)
                    b = random.randint(2, 6)
                    lower, upper = 1, 36
                elif diff == "Medium":
                    a = random.randint(7, 14)
                    b = random.randint(7, 14)
                    lower, upper = 1, 144
                elif diff == "Difficult":
                    a = random.randint(15, 23)
                    b = random.randint(15, 23)
                    lower, upper = 1, 400
                question_text = f"What is {a} × {b}?"
                answer = a * b
                options = generate_options(answer)
            
            elif op == "Division":
                if diff == "Easy":
                    b = random.randint(2, 6)
                    a = b * random.randint(2, 6)
                    lower, upper = 1, 20
                elif diff == "Medium":
                    b = random.randint(5, 13)
                    a = b * random.randint(7,15)
                    lower, upper = 1, 50
                elif diff == "Difficult":
                    b = random.randint(13, 23)
                    a = b * random.randint(15, 25)
                    lower, upper = 1, 100
                question_text = f"What is {a} ÷ {b}?"
                answer = a // b
                options = generate_options(answer)
            
            q = {
                "id": id_counter,
                "category": op,
                "difficulty": diff,
                "question": question_text,
                "options": options,
                "answer": answer
            }
            questions.append(q)
            id_counter += 1

with open("questions.json", "w") as f:
    json.dump(questions, f, indent=4)

print("Generated questions.json with", len(questions), "questions.")