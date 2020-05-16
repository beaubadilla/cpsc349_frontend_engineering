'''
    -2 letters or more
    -no prefixes
    -no suffixes
    -no duplicates, with every definition
    -make letters lowercase (there seems to be no proper nouns)
'''

import csv, json

with open('dictionary.csv', mode='r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    
    previous_word = ''
    js_dictionary = []
    for row in csv_reader:
        minimum_length = len(row['word']) > 0
        prefix = row['word'].startswith('-')
        suffix = row['word'].endswith('-')
        duplicate = row['word'] == previous_word

        is_valid_word = minimum_length and not prefix and not suffix
        if is_valid_word and not duplicate:

            lower_case_word = row['word'].lower()
            js_dictionary.append(
                {
                    'word': lower_case_word,
                    'definition': [row['definition']]
                }
            )

            previous_word = row['word']
        elif is_valid_word and duplicate:
            js_dictionary[len(js_dictionary) - 1]['definition'].append(
                row['definition']
            )

        previous_word = row['word']

    with open('dictionary.js', 'w') as js_file:
        js_file.write("let dictionary = ")
        json.dump(js_dictionary, js_file)