from django.shortcuts import render, HttpResponseRedirect, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from .models import status, word_name

# Create your views here.


def index(request):
    try:
        rating = status.objects.get(pk=1)
    except:
        rating = status.objects.create(num_right_word=0)

    rating.num_right_word = 0
    rating.win = 0
    rating.save()

    clearwords = word_name.objects.all().delete()
    return render(request, "words/search.html")


@csrf_exempt
def search(request):
    definition = ""
    notification = ""
    rel_word = ""
    if request.method == "GET":
        url2 = "https://api.datamuse.com/words?rel_spc=" + request.session["word"]
        d = requests.get(url2)
        e = d.text
        f = json.loads(e)
        # stored_index = request.session["num"]
        try:
            request.session["num"]
            # request.session["num"]["word"]
        except:
            request.session["num"] = 1

        # if request.session["num"] <= 4:
        request.session["num"] += 1
        # else:
        #     request.session["num"] = 0
        try:
            rel_word = f[request.session["num"]]["word"]
            rel_word = rel_word.replace(" ", "")

            request.session["rel_word"] = rel_word
            url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + rel_word + "?key=ab2b1b92-82ba-4134-a0ca-ac5f3de66804"
            x = requests.get(url)
            y = x.text
            all_text = json.loads(y)

            try:
                definition = all_text[0]["shortdef"][0]
            except:
                definition = "Unlucky...No Definition available"

            print("num", request.session["num"])
            print("num2", rel_word, request.session["num"])

        except:
            notification = "Word Category Exhausted. Choose another Word."
            print("notification", notification)
        return JsonResponse({"definition": definition, "rel_word": rel_word, "notification": notification}, status=201)

    elif request.method == "POST":
        data = json.loads(request.body)
        word = data.get("word", "")
        if word_name.objects.filter(searched_word=word).exists():
            print("Try another word")
            notification ="Sorry that word has already been searched. Choose another Word."
            return JsonResponse({"definition": definition, "rel_word": rel_word, "notification": notification}, status=201)
        else:
            word_name.objects.create(searched_word=word)
            # else:
            #     print("got it")
            # try:
            #     word.objects.get(pk=1)
            # except:
            #     word.objects.create(num_right_word=0)

            request.session["word"] = word
            request.session["num"] = 1
            print("corrected", word, type(word))

            url2 = "https://api.datamuse.com/words?rel_spc="+word
            d=requests.get(url2)
            e=d.text
            f=json.loads(e)
            rel_word = f[0]["word"].replace(" ", "")
            request.session["rel_word"] = rel_word.replace(" ", "")
            print("changed", rel_word)

            url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + rel_word + "?key=ab2b1b92-82ba-4134-a0ca-ac5f3de66804"
            x = requests.get(url)
            y = x.text
            all_text = json.loads(y)
            definition = all_text[0]["shortdef"][0]
            print(definition)
            print("notification", notification)
            return JsonResponse({"definition": definition, "rel_word": rel_word, "notification": notification}, status=201)

    else:
        return JsonResponse({"message": "POST method required"}, status=400)


@csrf_exempt
def guess(request):
    if request.method == "GET":
        return JsonResponse({"message": "POST method required"}, status=400)
    elif request.method == "POST":
        data = json.loads(request.body)
        guessed_letter = data.get("letter", "").lower()
        index = int(data.get("index", ""))

        word = data.get("word", "")
        actual_letter = word[index]
        if actual_letter == guessed_letter:
            answer = True
        else:
            answer = False

        print(guessed_letter, index, word, actual_letter, type(index), answer)

        return JsonResponse({"answer": answer}, status=201)
    else:
        return JsonResponse({"message": "POST or GET method required"}, status=400)

@csrf_exempt
def hint(request):
    if request.method != "GET":
        return JsonResponse({"message": "GET method required"}, status=400)

    else:
        url = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+request.session['rel_word']+"?key=ac3dcbec-a1c7-4512-89e9-1c3ca85abbb5"
        x = requests.get(url)
        y = x.text
        hint = json.loads(y)
        synonyms = hint[0]["meta"]["syns"][0][0:3]
        return JsonResponse({"synonyms": synonyms}, status=201)


@csrf_exempt
def guess_letter(request):

    if request.method != "POST":
        return JsonResponse({"message": "POST method required"}, status=400)
    else:
        rel_word = request.session["rel_word"]
        data = json.loads(request.body)
        picked_letter = data.get("picked_letter", "")

        store_index = []
        for index, value in enumerate(rel_word):
            if value == picked_letter:
                store_index.append(index)
            else:
                pass

        print(picked_letter, store_index, value)
        return JsonResponse({"store_index": store_index, "value": value}, status=201)


@csrf_exempt
def save(request):

    if request.method != "POST":
        return JsonResponse({"message": "POST method required"}, status=400)
    else:
        try:
            status.objects.get(pk=1)
        except:
            status.objects.create(num_right_word=0)
        data = json.loads(request.body)
        array_list = data.get("array_list", "")
        score=0
        win=0
        got_right = 0
        if all(array_list):
            print("great", array_list)
            rel_word = list(request.session["rel_word"])
            print("cool", rel_word)
            if array_list == rel_word:
                print("nice")
                rating = status.objects.get(pk=1)
                rating.num_right_word += 1
                rating.save()
                got_right = 1
                score = rating.num_right_word
                print("score", score, "got_right", got_right)
                if score == 10:
                    rating.win = True
                    score = rating.num_right_word
                    rating.num_right_word = 0
                    rating.save()
                    win = rating.win
                    # win = 1
                    print("win", win)
                else:
                    win = rating.win
                    # win = 1
                    print("win", win)

            else:
                rating = status.objects.get(pk=1)
                score = rating.num_right_word
                win = rating.win
                # win = 1
                print("win", win, "score", score)
                print("sorry")
        else:
            pass
        return JsonResponse({"got_right": got_right, "score": score, "win": win}, status=201)

@csrf_exempt
def reset(request):
    data = json.loads(request.body)
    reset = data.get("redo", "")
    if reset == 1:
        info = status.objects.get(pk=1)
        info.win = False
        info.save()
        restarted = info.win
    print("cooooool")
    return JsonResponse({"reset": restarted}, status=201)
