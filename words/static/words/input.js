/*General Variable declarations*/
let counter = 120;
//If changing counter also adjust counter at reset_game()
console.log("test1")
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#submit').disabled = true;
    document.querySelector('#user_word').onkeyup = () => {
        if (document.querySelector('#user_word').value.length > 0)
            document.querySelector('#submit').disabled = false;
        else
            document.querySelector('#submit').disabled = true;
    };

    const title = document.querySelector(".title")
    const phrases = document.querySelector(".phrases")
    const loss = document.querySelector("#loss_info")
    title.style.animationPlayState = 'paused'
    phrases.style.animationPlayState = 'paused'
    loss.style.animationPlayState = 'paused'
    var user_word = ""
    console.log("test2")
    document.querySelector("#compose_word").onsubmit = () => {
//        show_screen_elements()
    console.log("test3")
        var mytimer = setInterval(addcount, 1000)
        localStorage.setItem("mytimer", mytimer)
        document.querySelector("#user_word").onclick = () => {
            document.querySelector(".timer_label").innerHTML = "Paused"
            clearInterval(mytimer)
            localStorage.setItem("mytimer", "")
            var b_time = localStorage.getItem("mytimer")
            input_unpause()
        }

        var user_word = document.querySelector("#user_word").value
        var uw_len = user_word.length
        document.querySelector("#boxes").innerHTML= ""
        fetch('/search', {
            method: 'POST',
            body: JSON.stringify({
                word: user_word
            })
        })

        .then(response => response.json())
        .then(result => {
            var definition = result["definition"]
            var rel_word = result["rel_word"]
            localStorage.setItem('rel_word', rel_word)
            var rel_w_len = rel_word.length
            var notification = result["notification"]

            document.querySelector("#word_guess").style.display = 'block'
            document.querySelector(".timer").style.display = 'block'
            document.querySelector("#hint_guess_next_buttons").style.display = 'block'
            document.querySelector("#definition").innerHTML = definition;
            document.querySelector(".chosen_word").innerHTML = user_word
            document.querySelector("#info").innerHTML = ""
            document.querySelector("#def_text").style.display = "block"
            document.querySelector("#gen_text_search").innerHTML= "Change Word"
//            document.querySelector("#whatis_text").style.display = "block"

            create_entry_fields(rel_w_len)
//          Fill in 1st letter of boxes
            if(rel_word){
                document.getElementById(0).value = rel_word[0]
            }
            if (notification){
                document.querySelector("#info").innerHTML = notification
                document.querySelector("#hint_guess_next_buttons").style.display = 'none'
                document.querySelector("#def_text").style.display = "none"
            }
            match_letter()

            document.querySelector("#hint_button").onclick = () => {
                fetch('/hint')
                .then(response => response.json())
                .then(data => {
                console.log(data)
                var synonyms = data["synonyms"]
                document.querySelector("#synonym").innerHTML = synonyms;
                })
            }

            document.querySelector("#next_button").onclick = () => {
                get_next_associated_word()
            }

            document.querySelector("#guess_button").onclick = () => {
                document.querySelector("#virtual_keyboard").style.display = 'block'

            }

            document.querySelectorAll(".single_letter").forEach(single_letter => {
                single_letter.addEventListener("click", () => {
                unpause()
                    var picked_letter = single_letter.value;
                    fetch('guess_letter', {
                        method: "POST",
                        body: JSON.stringify({
                            picked_letter: picked_letter
                    })
                    })
                    .then(response => response.json())
                    .then(data => {console.log(data)
                        var store_index = JSON.stringify(data["store_index"])
                        console.log(store_index, picked_letter)
                        document.querySelectorAll(".input_box").forEach(input_box => {
                            if(store_index.includes(input_box.id) === true){
                            console.log("almost there", input_box.value)
                            input_box.value = picked_letter;
                            }
                        })
                    })
                })
            })
            document.querySelector('#user_word').value = ""
            document.querySelector('#submit').disabled = true;
            document.querySelector("#play").onclick = () => {
                show_screen_elements()
                if(!user_word){
                    document.querySelector("#word_guess").style.display = "none"
                    document.querySelector("#hint_guess_next_buttons").style.display = "none"
                    document.querySelector(".timer").style.display = "none"
                }
            }
        })
        return false;
    }
    document.querySelector("#about").onclick = () => {
        clear_screen()
        document.querySelector("#about_info").style.display = "block"
        phrases.style.animationPlayState = 'running'
    }

    document.querySelector("#play").onclick = () => {
        show_screen_elements()
        if(!user_word){
            document.querySelector("#word_guess").style.display = "none"
            document.querySelector("#hint_guess_next_buttons").style.display = "none"
            document.querySelector(".timer").style.display = "none"
        }
    }
})


/*Function definitions-----------------------*/
function clear_screen(){
    document.querySelector("#word_entry").style.display = 'none'
    document.querySelector("#word_guess").style.display = 'none'
    document.querySelector(".timer").style.display = 'none'
    document.querySelector("#synonym").style.display = 'none'
    document.querySelector("#virtual_keyboard").style.display = 'none'
    document.querySelector("#hint_guess_next_buttons").style.display = 'none'
    document.querySelector(".chosen_word").style.display = 'none'
    document.querySelector("#win_info").style.display = 'none'
    document.querySelector("#loss_info").style.display = 'none'
    document.querySelector("#about_info").style.display = 'none'
}

function show_screen_elements(){
    document.querySelector("#word_entry").style.display = 'block'
    document.querySelector("#word_guess").style.display = 'block'
    document.querySelector(".timer").style.display = 'block'
    document.querySelector("#synonym").style.display = 'block'
    document.querySelector("#hint_guess_next_buttons").style.display = 'block'
    document.querySelector("#about_info").style.display = 'none'
    document.querySelector(".chosen_word").style.display = 'block'
}

function create_entry_fields(w_len){
    for(var i=0;i<w_len; i++){
        var entry = document.createElement("input");
        entry.setAttribute("class", "input_box");
        entry.setAttribute("id", i)
        entry.setAttribute("maxlength", 1);
        entry.setAttribute("size", 1);
        document.querySelector("#boxes").append(entry);
    }
}

function get_next_associated_word(){
    fetch('/search')
        .then(response => response.json())
        .then(adj_data => {
            var adj_definition = adj_data["definition"]
            var adj_word = adj_data["rel_word"]
            localStorage.setItem('rel_word', adj_word)
            var adj_w_len = adj_word.length
            document.querySelector("#definition").innerHTML = adj_definition;
            document.querySelector("#boxes").innerHTML= ""
            var notification = adj_data["notification"]
            if (notification){
                document.querySelector("#info").innerHTML = notification
                document.querySelector("#def_text").style.display = "none"
            }
            create_entry_fields(adj_w_len)
            document.getElementById(0).value = adj_word[0]
            match_letter()
            input_unpause()
            unpause()
            document.querySelector("#synonym").innerHTML = ""
        })
}


function match_letter(){
    document.querySelectorAll(".input_box").forEach(input_box => {
        input_box.addEventListener('input', () => {

            var letter = document.getElementById(input_box.id).value

            localStorage.setItem("letter", letter)
            localStorage.setItem("input_box_id", input_box.id)
            fetch('/guess', {
                method: "POST",
                body: JSON.stringify({
                    letter: letter,
                    index: input_box.id,
                    word: localStorage.getItem('rel_word')
                })
            })
            .then(response => response.json())
            .then(data => {
                var result = JSON.stringify(data)
                if(letter == ""){
                    document.getElementById(input_box.id).style.background = "";
                }
                else{
                    if(data["answer"] === false){
                        console.log("That's wrong.")
                        document.getElementById(input_box.id).style.background = "red";
                    }
                    else{
                        document.getElementById(input_box.id).style.background = "";
                    }
                }

                var q = parseInt(input_box.id)
                var r = localStorage.getItem("rel_word").length
                if (q+1 != r){
                    document.getElementById(q+1).focus()
                }
                verify_word_entry()
            })
        })
    })
}


function verify_word_entry(){
    var myNodelist = document.querySelectorAll(".input_box");
    var myNodelistArr = Array.from(myNodelist)
    var array_input_box = []
    for(var i=0; i<myNodelistArr.length; i++){
        array_input_box.push(myNodelistArr[i].value)
    }
    fetch('/save', {
        method: "POST",
        body: JSON.stringify({
            array_list: array_input_box
        })
    })
    .then(response => response.json())
    .then(value => {
        var score = value["score"]
        var win = value["win"]
        var got_right = value["got_right"]
//        console.log("got_right", got_right)
//        console.log("score", score)
        localStorage.setItem("score", score)
        localStorage.setItem("win", win)
        console.log("win", win)
        if(got_right == 1){
            get_next_associated_word()
            counter = counter + 10;
        }
        if(score>0){
            document.getElementById(score+"_tl").style.color = "green"
        }
        if(win == true){
            const title = document.querySelector(".title")
            title.style.animationPlayState = 'running'
            clear_screen()
            document.querySelector("#win_info").style.display = 'block'
            document.querySelector("#play").onclick = () => {
                reset_game()
            }
        }
    })
}


function addcount(){
    counter--
    var abc = (counter*345/120) - (345/120);
    var bcd = 345
    var timer_number = abc.toString() + " " + bcd.toString()
    if(counter != 0){
        document.querySelector(".timer_label").innerHTML = timeremaining(counter)
        document.getElementById("timer_path_left").setAttribute("stroke-dasharray", timer_number)
    }

    else{
        clear_screen()
        document.querySelectorAll(".title_letter").forEach(title_letter => {
            title_letter.style.color = "red"
            document.querySelector("#loss_info").style.display = 'block'
        })
        document.querySelector("#play").onclick = () => {
        reset_game()
        }
    }
}


function reset_game(){
clear_screen()
    document.querySelector("#word_entry").style.display = 'block'
    document.querySelector(".chosen_word").style.display = 'block'
    document.querySelector(".chosen_word").innerHTML = ""
    document.querySelectorAll(".title_letter").forEach(title_letter => {
        title_letter.style.color = ""
    })
    document.querySelector("#compose_word").onclick = () => {
        counter = 120;
        console.log("howdy?")
        fetch("/reset", {
            method: "POST",
            body: JSON.stringify({
            redo: 1,
            })
        })
        .then(response => response.json())
        .then(data => {
            var restarted = data["reset"]
            console.log("restarted", restarted)
            document.querySelector("#synonym").style.display = 'block'
        })
    }
}

function timeremaining(timeleft){
    let min = Math.floor(timeleft/60);
    let sec = timeleft % 60;
    if(sec<10){
        sec = `0${sec}`;
    }
    return `${min}:${sec}`;
}

function input_unpause(){
    document.querySelectorAll(".input_box").forEach(input_box => {
        input_box.addEventListener('click', () => {
            unpause()
        })
    })
}

function unpause(){
    var a_time = localStorage.getItem("mytimer")
    console.log("a_time", a_time)
    if(a_time == ""){
        var mytimer2 = setInterval(addcount, 1000)
        localStorage.setItem("mytimer", mytimer2)
        console.log("I see")
        document.querySelector("#user_word").onclick = () => {
            clearInterval(mytimer2)
            localStorage.setItem("mytimer", "")
            console.log("inner code", mytimer2)
            document.querySelector(".timer_label").innerHTML = "Paused"
        }
    }
}
