package main

import (
	"flag"
	"github.com/unrolled/render"

	"log"
	"net/http"

	"klubox/infrastructure/db"
	"klubox/infrastructure/registry"
	"klubox/infrastructure/router"
)

var (
	port = flag.String("http_address", "8080", "http port for all services")

	formatter = render.New(render.Options{
		IndentJSON: true,
	})
)

func main() {
	mgo, err := db.NewMongoHandler()
	if err != nil {
		log.Fatal("Failed to start server", err)
	}

	handlers := registry.NewRegistry(mgo)

	routes := router.RegisterServiceRoutes(handlers)

	log.Printf(`Starting Server Powered By kluBox (c) On Port: %v

    	..      ..                 ....
    	..      ..                 ..   ..                                   .
    	..      ..                 ..   ..                                 . . .
    	..      ..                 .......                               .   .   .
    	.....   ..    ..       ..  ...|         ....    ...  ...         .   .   .
    	...     ..    ..       ..  .......    ..    ..    ....           . .   . .
    	..      ..    ..       ..  ..   ..    ..    ..     ..            .       .
    	...     ...    ..     ..   ..  ..      ..  ..     ....             .   .
    	.....   .....    .. ..     ....          ..     ...  ...             .

    `, *port)



	err = http.ListenAndServe(":"+*port, router.NewRouter(routes))
	if err != nil {
		log.Fatal("Failed to start server", err)
	}
}
