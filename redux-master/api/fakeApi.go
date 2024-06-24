package api

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"reflect"
	"strings"
	"time"
	"unicode"

	"github.com/gorilla/mux"
	"github.com/jaswdr/faker"
)

const POSTS_PER_USER = 3
const NUM_USERS = 3

type StructPostAdd struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	User    string `json:"user"`
}

type StructPostEdit struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Id      string `json:"id"`
}

type StructReactionEdit struct {
	PostId   string `json:"postId"`
	Reaction string `json:"reaction"`
}

type StructUser struct {
	Id        string `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Name      string `json:"name"`
	UserName  string `json:"username"`
}

type StructReaction struct {
	Id       string `json:"id"`
	ThumbsUp int    `json:"thumbsUp"`
	Hooray   int    `json:"hooray"`
	Heart    int    `json:"heart"`
	Rocket   int    `json:"rocket"`
	Eyes     int    `json:"eyes"`
}

type StructPost struct {
	Id        string         `json:"id"`
	Title     string         `json:"title"`
	Date      string         `json:"date"`
	Content   string         `json:"content"`
	Reactions StructReaction `json:"reactions"`
	User      string         `json:"user"`
}

type StateNotification struct {
	Id      string `json:"id"`
	Date    string `json:"date"`
	Message string `json:"message"`
	User    string `json:"user"`
	Read    bool   `json:"read"`
	IsNew   bool   `json:"isNew"`
}

var mapUser = make(map[string]StructUser)
var mapPost = make(map[string]StructPost)

var fake faker.Faker

func createUserData() (string, StructUser) {
	p := fake.Person()
	id := p.SSN()
	firstName := p.FirstName()
	lastName := p.LastName()
	userName := fake.Internet().User()

	return id, StructUser{id, firstName, lastName, firstName + " " + lastName, userName}
}

func createReaction() StructReaction {
	p := fake.Person()
	id := p.SSN()

	return StructReaction{id, 0, 0, 0, 0, 0}
}

func createPostData(user string) (string, StructPost) {
	p := fake.Person()
	id := p.SSN()
	words := fake.Lorem().Words(3)
	resp := strings.Join(words, " ")

	tm := time.Now().Add(-time.Minute * time.Duration(rand.Intn(15)))

	return id, StructPost{id, resp, tm.UTC().Format("2006-01-02T15:04:05.999Z"), fake.Lorem().Paragraph(3), createReaction(), user}
}

// Create an initial set of users and posts
func init() {
	fake = faker.New()

	for i := 0; i < NUM_USERS; i++ {
		id, user := createUserData()
		mapUser[id] = user

		for j := 0; j < POSTS_PER_USER; j++ {
			id, post := createPostData(user.Id)
			mapPost[id] = post
		}
	}
}

func PostsGet(w http.ResponseWriter, r *http.Request) {
	var posts []StructPost

	for _, v := range mapPost {
		posts = append(posts, v)
	}

	if resp, err := json.Marshal(posts); err == nil {
		w.Write(resp)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}

func PostGet(w http.ResponseWriter, r *http.Request, postId string) bool {
	success := false

	defer func() {
		if !success {
			w.WriteHeader(http.StatusNotFound)
		}
	}()

	if post, ok := mapPost[postId]; ok {
		if resp, err := json.Marshal(post); err == nil {
			success = true

			w.Write(resp)
		}
	}

	return success
}

func PostAdd(w http.ResponseWriter, r *http.Request) {
	success := false

	defer func() {
		if !success {
			w.WriteHeader(http.StatusNotFound)
		}
	}()

	add := &StructPostAdd{}

	if err := json.NewDecoder(r.Body).Decode(add); err == nil {
		if add.Content == "error" {
			w.Write([]byte("Server error saving this post!"))
		} else {
			p := fake.Person()
			id := p.SSN()

			post := StructPost{id, add.Title, time.Now().UTC().Format("2006-01-02T15:04:05.999Z"), add.Content, createReaction(), add.User}
			mapPost[id] = post

			if resp, err := json.Marshal(post); err == nil {
				success = true

				w.Write(resp)
			}
		}
	}
}

func PostEdit(w http.ResponseWriter, r *http.Request, postId string) {
	success := false

	defer func() {
		if !success {
			w.WriteHeader(http.StatusNotFound)
		}
	}()

	if post, ok := mapPost[postId]; ok {
		var js StructPostEdit

		decoder := json.NewDecoder(r.Body)

		if err := decoder.Decode(&js); err == nil {
			post.Title = js.Title
			post.Content = js.Content

			mapPost[postId] = post

			if resp, err := json.Marshal(post); err == nil {
				success = true

				w.Write(resp)
			}
		}
	}
}

func Users(w http.ResponseWriter, r *http.Request) {
	var user []StructUser

	for _, v := range mapUser {
		user = append(user, v)
	}

	if resp, err := json.Marshal(user); err == nil {
		w.Write(resp)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}

func Posts(w http.ResponseWriter, r *http.Request) {
	//time.Sleep(2 * time.Second)

	switch r.Method {
	case "GET":
		vars := mux.Vars(r)

		if postId, ok := vars["postId"]; ok {
			PostGet(w, r, postId)
		} else {
			PostsGet(w, r)
		}

	case "POST":
		PostAdd(w, r)

	case "PATCH":
		vars := mux.Vars(r)

		if postId, ok := vars["postId"]; ok {
			PostEdit(w, r, postId)
		} else {
			w.WriteHeader(http.StatusNotFound)
		}
	}
}

func Reaction(w http.ResponseWriter, r *http.Request) {
	success := false

	defer func() {
		if !success {
			w.WriteHeader(http.StatusNotFound)
		}
	}()

	vars := mux.Vars(r)

	if postId, ok := vars["postId"]; ok {
		if post, ok := mapPost[postId]; ok {
			edit := &StructReactionEdit{}

			if err := json.NewDecoder(r.Body).Decode(edit); err == nil {
				// It capitalize the first letter of a string
				// ex) thumbsUp to ThumbsUp
				upper := []rune(edit.Reaction)
				upper[0] = unicode.ToUpper(upper[0])
				reaction := string(upper)

				// get count of a reaction
				count := reflect.ValueOf(&post.Reactions).Elem().FieldByName(reaction).Int()
				// add count of a reaction
				reflect.ValueOf(&post.Reactions).Elem().FieldByName(reaction).SetInt(count + 1)

				mapPost[postId] = post

				success = PostGet(w, r, postId)
			}
		}
	}
}

func Notifications(w http.ResponseWriter, r *http.Request) {
	var notificationTemplates = []string{
		"poked you",
		"says hi!",
		"is glad we're friends",
		"sent you a gift",
	}
	var notification []StateNotification
	var tm time.Time = time.Now().Add(-time.Minute * 15)

	/*
		since := r.URL.Query().Get("since")

		if 0 == len(since) {
			tm = time.Now().Add(-time.Minute * 15)
		} else {
			tm, _ = time.Parse("2006-01-02T15:04:05.999Z", since)
		}
	*/

	diff := int(time.Now().Sub(tm).Minutes()) + 1

	count := rand.Intn(4) + 1

	for i := 0; i < count; i++ {
		randUser := rand.Intn(len(mapUser))
		randTemplate := rand.Intn(len(notificationTemplates))
		userCount := 0
		user := ""

		for k := range mapUser {
			if randUser == userCount {
				user = k
				break
			}

			userCount++
		}

		p := fake.Person()
		id := p.SSN()
		date := tm.Add(time.Minute * time.Duration(rand.Intn(diff)))

		notification = append(notification, StateNotification{
			id,
			date.UTC().Format("2006-01-02T15:04:05.999Z"),
			notificationTemplates[randTemplate],
			user,
			false,
			true,
		})
	}

	if resp, err := json.Marshal(notification); err == nil {
		w.Write(resp)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}
