package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"webserver/api"

	"github.com/gorilla/mux"
)

// manifest.json 파일 읽고 index.html 만들기
func makingHTML() string {
	result := true
	html := ""

	logging := func(err error) {
		log.Println(err)

		result = false
	}

	defer func() {
		if !result {
			html = ""
		}
	}()

	script := ""

	// 웹팩으로 생성한 js 파일들을 HTML의 script 테그에 삽입하기 위한 코드
	if jsonFile, err := os.Open("dist/manifest.json"); err == nil {
		if bytes, err := io.ReadAll(jsonFile); err == nil {
			var m map[string]string

			if err := json.Unmarshal(bytes, &m); err == nil {
				for _, v := range m {
					// prefix 'auto/' 제거
					script += "		<script type=\"text/javascript\" src=\"/dist/" + v + "\"></script>\r\n"
				}
			} else {
				logging(err)
			}
		} else {
			logging(err)
		}
	} else {
		logging(err)
	}

	html = `<!DOCTYPE html>
<html>
	<head>
		<title>Redux App</title>

		<meta charset="UTF-8" />
	</head>
	<body>
		<!--div id="root" style="position: absolute; top: 30%; left: 30%;-->
		<div id="root">
		</div>
`
	html += script
	html += `	</body>
</html>`

	return html
}

// 홈 페이지
func home(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// manifest.json 파일 읽고 index.html 만들기
	html := makingHTML()

	if len(html) == 0 {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte(html))
	}
}

// 웹 서버
func web() {
	fs := http.FileServer(http.Dir("dist"))
	http.Handle("/dist/", http.StripPrefix("/dist/", fs))

	// 라우터 생성
	r := mux.NewRouter()
	// 홈 페이지 접속
	r.HandleFunc("/", home)

	// REST API
	fakeApi := r.PathPrefix("/fakeApi").Subrouter()

	fakeApi.HandleFunc("/users", api.Users).Methods(http.MethodGet)
	fakeApi.HandleFunc("/posts", api.Posts).Methods(http.MethodGet)
	fakeApi.HandleFunc("/posts", api.Posts).Methods(http.MethodPost)
	fakeApi.HandleFunc("/posts/{postId}", api.Posts).Methods(http.MethodGet)
	fakeApi.HandleFunc("/posts/{postId}", api.Posts).Methods(http.MethodPatch)
	fakeApi.HandleFunc("/posts/{postId}/reactions", api.Reaction).Methods(http.MethodPatch)
	fakeApi.HandleFunc("/notifications", api.Notifications).Methods(http.MethodGet)

	http.Handle("/", r)

	// 웹 서버 동작
	if err := http.ListenAndServe(":5500", nil); err != nil {
		log.Fatalln(err)
	}
}
