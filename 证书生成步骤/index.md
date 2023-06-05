### 生成证书的步骤：

1. 生成私钥：

```shell

openssl genrsa -out server.key 2048

```

生成密码保护的私钥：

```shell

openssl genrsa -aes256 -out server.key 2048

```

`server.key`是要生成的私钥文件名，`2048`是密钥长度。

2. 生成CSR：

```shell

openssl req -new -key server.key -out server.csr

```

`server.key`是上一步生成的私钥，`server.csr`是要生成的证书签名请求。在这个过程中，您会被要求输入一些信息。

3. 生成证书：

如果要生成简单的证书，可以直接使用以下命令：

```shell

openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

```

如果要生成多域名证书，请创建文件 `san.cnf`，内容如下：

```shell

[SAN]

subjectAltName = @alt_names

[alt_names]

DNS.1 = example.com
DNS.2 = *.example.com
IP.1 = 192.168.0.1

```

然后使用以下命令：

```shell

openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt -extensions v3_req -extfile san.cnf

```

这种方法我使用 `openssl x509 -in server.crt -text -noout` 进行验证过了，生成的证书中包含多个域名。

也可以使用以下命令：

```shell

openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt -extensions SAN -extfile <(printf "[SAN]\nsubjectAltName=DNS:example.com,DNS:*.example.com,IP:192.168.0.1")

```

`server.csr` 和 `server.key` 是上一步生成的两个文件，`365` 是证书有效期，为1年，`server.crt` 是要生成的证书。注意：要让客户端安装 `server.crt` 以信任证书。如果要添加多个域名或IP，请按照文件中的格式继续填写，如果没有可不填。DNS可以使用通配符，域名不可以。

如果要将 `server.crt` 转换为PKCS#12文件，请使用以下命令：

```shell

openssl pkcs12 -export -in server.crt -inkey server.key -out server.pfx

```

这个过程会要求输入密码，因为pfx文件中包含私钥，请保管好您的pfx文件。

