function generateSecurePassword() {
    const name = document.getElementById('name').value.substring(0, 3).toUpperCase();
    const bday = document.getElementById('bday').value.substring(2);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let password = name + "-" + bday + "-";
    for(let i=0; i<8; i++) password += chars[Math.floor(Math.random() * chars.length)];
    document.getElementById('passDisplay').innerText = password;
}
