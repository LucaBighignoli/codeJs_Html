import json
import random

questions = []
id_counter = 1

# Define categories and difficulties
operations = ["Addition", "Subtraction", "Multiplication", "Division", "Exponents"]
difficulties = ["Iron", "Bronze", "Silver", "Gold", "Diamond"]

# Define ranges based on difficulty for general numbers
ranges = {
    "Iron": (1, 10),
    "Bronze": (11, 20),
    "Silver": (21, 50),
    "Gold": (51, 100),
    "Diamond": (101, 200)
}

# Define base ranges for exponents based on difficulty
base_ranges = {
    "Bronze": (2, 3),
    "Silver": (2, 4),
    "Gold": (2, 5),
    "Diamond": (2, 6)
}

try:
    for op in operations:
        for diff in difficulties:
            for i in range(20):
                # Skip exponents for Iron category
                if op == "Exponents" and diff == "Iron":
                    continue

                # Get the range based on difficulty
                low, high = ranges[diff]
                if low == high:
                    a = b = low  # Use single value if range is the same
                else:
                    a = random.randint(low, high)
                    b = random.randint(low, high)

                if op == "Addition":
                    question_text = f"What is {a} + {b}?"
                    answer = a + b

                elif op == "Subtraction":
                    if a < b:
                        a, b = b, a  # Ensure a is larger for positive results
                    question_text = f"What is {a} - {b}?"
                    answer = a - b

                elif op == "Multiplication":
                    question_text = f"What is {a} × {b}?"
                    answer = a * b

                elif op == "Division":
                    if b == 0:
                        b = 1  # Avoid division by zero
                    a = b * random.randint(1, high if high > 1 else 2)
                    question_text = f"What is {a} ÷ {b}?"
                    answer = a // b

                elif op == "Exponents":
                    # Ensure valid range for base
                    if diff in base_ranges:
                        base_low, base_high = base_ranges[diff]
                        if base_low == base_high:
                            base = base_low  # Use the single value if range is the same
                        else:
                            base = random.randint(base_low, base_high)
                        exponent = random.randint(2, 3)  # Keep exponents small
                        answer = base ** exponent
                        question_text = f"What is {base}^{exponent}?"
                    else:
                        continue  # Skip if no valid range

                # Append question to list
                q = {
                    "id": id_counter,
                    "category": op,
                    "difficulty": diff,
                    "question": question_text,
                    "answer": answer
                }
                questions.append(q)
                id_counter += 1

    # Save questions to octajson.json
    print("Saving questions to octajson.json...")
    with open("octajson.json", "w") as f:
        json.dump(questions, f, indent=4)
    print(f"Saved {len(questions)} questions to octajson.json successfully!")

    # Print questions as JSON for sessionStorage
    print(json.dumps(questions))

except Exception as e:
    print(f"An error occurred: {e}")
