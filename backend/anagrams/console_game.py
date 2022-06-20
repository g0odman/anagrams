from anagrams.game import Game

game = Game(['uri'])
for i in range(4):
    game.flip(0)
while True:
    print('Current Game Status:')
    print('Current letters:', game.current_letters())
    print('Remaining letters count:', game.remaining_letters_count())
    for num, player in enumerate(game.players()):
        print(f'Player {num}: {player}')
    action = input("Please choose your action:")
    if not action:
        game.flip(0)
    elif action.startswith('s'):
        game.steal(0, 0, action[1:])
    else:
        game.take(0, action[1:])
