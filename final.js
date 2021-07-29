const http = require("http");
const mariadb = require("mariadb");
const url = require("url");


/*const pool = mariadb.createPool({
    host: "db2019.if.unismuh.ac.id",
    port: "3318",
    user: "root",
    password: "if2019",
    database: "latihan",
    connectionLimit: 5, 
});*/

const getConnect = async () => {
    try{
        const conn = await mariadb.createConnection('mariadb://root:if2019@db2019.if.unismuh.ac.id:3318/latihan');
        //console.log('connection succes');
        return conn;
    }catch (err){ 
        return err;
    }
};


const mahasiswaFindAll = async () => {
    
    try{
        const conn = await getConnect();
        const rows = await conn.query(`SELECT * FROM mahasiswa LIMIT 20`);
       
        return rows;

    }catch(err){ 
        return err;
    }
};


const mahasiswaFindOne = async (nim) => {
try{
    const conn = await getConnect();
    const rows = await conn.query(`SELECT * FROM mahasiswa WHERE nim=?`, [nim]);
    console.log(rows[0]);
    return rows[0];
}catch (err){
    console.log(err);
    // if (conn) conn.release();
    return err;
}finally{
    // if (conn) conn.release();
}
};

const server = http.createServer(async(request, response) => {
    const parsedURL = url.parse(request.url,true);
    console.log(parsedURL);

    const mahasiswa = await mahasiswaFindAll();
    const mahasiswafind = await mahasiswaFindOne(`${parsedURL.query.nim}`);
     //const mahasiswa = await mahasiswaFindOne('105841103219');
    console.log(mahasiswa);

    if (parsedURL.pathname === '/') {
        response.statusCode = 200;
        response.setHeader("Content-Type", "Text/html");
        response.write(`
            <h3>
            NAMA  : SYARIFUL MUJADDIQ<br>
            NIM   : 105841103219<br>
            KELAS : INFORMATIKA 4A<br><br>
            </h3>
    
            <center><h3>LIST MAHASISWA INFORMATIKA 2019</h3></center>
            `);
        mahasiswa.map((elemen) => {
            response.statusCode = 200;
            response.write(`
            <ul>
                <li><a href="profil?nim=${elemen.nim}">${elemen.nama}</a></li>
    
            </ul>
            `);
            //response.write(`\nNIM : ${elemen.nim}<br>`);
            //response.write(`\nNAMA : ${elemen.nama}<br>`);
            //response.write(`\nNIM : ${elemen.nim}`);
        });
        //response.write(`\nNIM : ${mahasiswa.nim}<br>`);
        //response.write(`\nNAMA : ${mahasiswa.nama}`);
    
        response.end();
    
    }else if(parsedURL.pathname === '/profil'){
        response.statusCode = 200;
        response.setHeader("Content-Type", "Text/html");

       
    response.write(`
    <table width="745" border="1" cellspacing="0" cellpadding="5" align="center">
<tr align="center" bgcolor="#6495ED">
<td width="174">DATA DIRI</td>
<td width="353">KETERANGAN</td>
<td width="232">FOTO</td>
</tr>
<tr>
<td>NIM</td>
<td>${mahasiswafind.nim}</td>
<td rowspan="10" align="center"><img src="https://simak.unismuh.ac.id/upload/mahasiswa/${parsedURL.query.nim}.jpg"></td>
</tr>
<tr>
<td>Nama</td>
<td>${mahasiswafind.nama}</td>
</tr>
<tr>
<td>Tempat Lahir</td>
<td>${mahasiswafind.tempat_lahir}</td>
</tr>
<tr>
<td>Tanggal Lahir</td>
<td>${mahasiswafind.tanggal_lahir}</td>
</tr>
<tr>
<td>Jenis Kelamin</td>
<td>${mahasiswafind.jenis_kelamin}</td>
</tr>
<tr>
<td>Provinsi</td>
<td>${mahasiswafind.provinsi}</td>
</tr>
<tr>
<td>Kabupaten</td>
<td>${mahasiswafind.kabupaten}</td>
</tr>
<tr>
<td>Kecamatan</td>
<td>${mahasiswafind.kecamatan}</td>
</tr>
</table>
    `);
    
 
        response.end();
    }else {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html');
        response.write('halaman tdk di temukan');
        response.end();
       }

   

}); 

server.listen(4004, () =>{
    console.log(`Server listen http://129.213.54.196:4004`);
    
});
