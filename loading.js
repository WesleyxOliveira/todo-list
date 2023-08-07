function showLoading() {
    const body = document.getElementsByTagName('body')[0];

    const div = document.createElement('div');
    div.classList.add('loading');
    div.innerText = 'loading...';
    div.style.display = 'flex';

    body.appendChild(div);
}

function hideLoading() {
    let loading = document.querySelector('.loading');

    loading.style.display = 'none';
}