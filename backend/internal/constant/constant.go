package constant

type HttpMethod string

const (
	GET    HttpMethod = "GET"
	POST   HttpMethod = "POST"
	PUT    HttpMethod = "PUT"
	DELETE HttpMethod = "DELETE"
)

type EndpointType string

const (
	MARKET      EndpointType = "market"
	TRADING     EndpointType = "trading"
	FOREIGN     EndpointType = "foreign"
	STATIC_DATA EndpointType = "static_data"
)

type ProviderSource string

func (p ProviderSource) Value() {
	panic("unimplemented")
}

const (
	MAS ProviderSource = "mas"
)
