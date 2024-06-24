package main

import (
	"runtime"
)

// 각 파일의 init 함수가 실행된 후 main 함수가 실행된다.
func init() {
	// 멀티 프로세서 사용
	runtime.GOMAXPROCS(runtime.NumCPU())
}

func main() {
	// 웹 서버 실행
	web()
}
