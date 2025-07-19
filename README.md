# gRPC Demo

A practical demonstration of gRPC (Remote Procedure Call) implementation using Node.js, showcasing client-server communication with Protocol Buffers.

## What This Demo Shows

This project demonstrates how to build gRPC services in Node.js by implementing a simple client-server architecture. You'll learn how to define services using Protocol Buffers, handle RPC calls, and establish efficient communication between Node.js applications.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (version 14 or later)
- npm or yarn package manager

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/MahmoudEl3bady/grpc-demo.git
cd grpc-demo
npm install
```

### Running the Demo

Start the gRPC server:

```bash
npm run start:server
```

In a separate terminal, run the client:

```bash
npm run start:client
```

## Technologies Used

- **@grpc/grpc-js**: Pure JavaScript gRPC implementation
- **@grpc/proto-loader**: Dynamic loading of Protocol Buffer definitions
- **Protocol Buffers**: Language-neutral data serialization

## Resources

- [gRPC Node.js Documentation](https://grpc.github.io/grpc/languages/node/)
- [Protocol Buffers JavaScript Guide](https://developers.google.com/protocol-buffers/docs/reference/javascript-generated)
