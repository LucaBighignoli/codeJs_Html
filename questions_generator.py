import json
import random

def generate_options(correct_answer):
    """
    Generate three fake answer options that are close to the correct answer.
    """
    if abs(correct_answer) < 50:
        lower_bound = max(0, correct_answer - 5)
        upper_bound = correct_answer + 5
    else:
        margin = max(1, int(0.1 * abs(correct_answer)))
        lower_bound = correct_answer - margin
        upper_bound = correct_answer + margin

    possible_options = [num for num in range(lower_bound, upper_bound + 1) if num != correct_answer]

    if len(possible_options) < 3:
        raise ValueError("Not enough numbers in the range to generate fake answers.")

    fake_options = random.sample(possible_options, 3)

    options = fake_options + [correct_answer]
    random.shuffle(options)

    return options


questions = []
id_counter = 1

operations = ["Addition", "Subtraction", "Multiplication", "Division"]
difficulties = ["Easy", "Medium", "Difficult"]

# **Use a set to track unique (a, b, operation, difficulty) pairs**
generated_questions = set()

for op in operations:
    for diff in difficulties:
        unique_questions = set()  # Track unique (a, b) pairs for this operation/difficulty

        while len(unique_questions) < 20:  # Ensure 20 unique questions
            if op == "Addition":
                if diff == "Easy":
                    a, b = random.randint(1, 30), random.randint(1, 20)
                elif diff == "Medium":
                    a, b = random.randint(30, 70), random.randint(21, 50)
                elif diff == "Difficult":
                    a, b = random.randint(71, 120), random.randint(51, 100)
                answer = a + b
                question_text = f"What is {a} + {b}?"

            elif op == "Subtraction":
                if diff == "Easy":
                    a = random.randint(2, 30)
                    b = random.randint(1, a-1)
                elif diff == "Medium":
                    a = random.randint(31, 70)
                    b = random.randint(21, a-1)
                elif diff == "Difficult":
                    a = random.randint(71, 150)
                    b = random.randint(51, a-1)
                answer = a - b
                question_text = f"What is {a} - {b}?"

            elif op == "Multiplication":
                if diff == "Easy":
                    a, b = random.randint(2, 10), random.randint(2, 10)
                elif diff == "Medium":
                    a, b = random.randint(11, 21), random.randint(11, 21)
                elif diff == "Difficult":
                    a, b = random.randint(23, 35), random.randint(23, 35)
                answer = a * b
                question_text = f"What is {a} × {b}?"

            elif op == "Division":
                if diff == "Easy":
                    b = random.randint(2, 12)
                    a = b * random.randint(2, 12)
                elif diff == "Medium":
                    b = random.randint(13, 21)
                    a = b * random.randint(13, 21)
                elif diff == "Difficult":
                    b = random.randint(23, 35)
                    a = b * random.randint(23, 35)
                answer = a // b
                question_text = f"What is {a} ÷ {b}?"

            # **Ensure uniqueness using (a, b, operation, difficulty)**
            question_signature = (a, b, op, diff)
            if question_signature in generated_questions:
                continue  # Skip duplicates and generate a new question

            generated_questions.add(question_signature)
            unique_questions.add((a, b))

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

print("Generated questions.json with", len(questions), "unique questions.")