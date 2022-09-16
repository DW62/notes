# JWT工具类

```java
/**
 * JWT工具类
 */
public class JWTUtil {
    //设置保存时长
    private static final long EXPIRE=60*1000;
    //设置加密密钥
    private static final String ENCRYPTIONKEY="admin";
    //设置加密方式,通常都使用HS256
    private static final String ENCRYPTION="HS256";

    //获取token
    public  String getToken(String key,Object value){
        //创建jwt对象
        JwtBuilder jwtBuilder= Jwts.builder();
        String token = jwtBuilder
                //设置header部分
                .setHeaderParam("type", "JWT")
                .setHeaderParam("alg", ENCRYPTION) //指定加密算法为HS256
                //设置payload部分
                .claim(key, value) //设置存储的信息为userId，值为1
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE))//设置过期时间=当前时间加上保存时长
                .setId(UUID.randomUUID().toString())//设置tokenID
                //设置signature
                .signWith(SignatureAlgorithm.valueOf(ENCRYPTION), ENCRYPTIONKEY)//设置加密算法(要和上面一致)和加密密钥
                .compact();
        return token;
    }
    /**
     * 解析token
     * @param token token值
     * @return
     * 可以直接根据获取的Claims对象使用get方法传入设置的key获取对应的值
     */
    public Claims parseToken(String token){
        try{
            return Jwts.parser()
                    .setSigningKey(ENCRYPTIONKEY)
                    .parseClaimsJws(token)
                    .getBody();
        }catch (Exception e){
            return null;
        }
    }
}
```

