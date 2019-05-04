package main

import (
	"flag"
	"log"
	"net/http"
)

var port = flag.String("http_address", "8080", "http port for all services")

func main() {
	routes := RegisterServiceRoutes()

	log.Printf("Starting server powered by klubox-lite (c) On port: %v", *port)

	err := http.ListenAndServe(":"+*port, routes)
	if err != nil {
		log.Fatal("Failed to start server", err)
	}
}
