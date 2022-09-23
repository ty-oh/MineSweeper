class MineBox {
    constructor(box, isMine, number) {
        this.box = box;
        this.isMine=isMine;
        this.number=number;
    }
}

function cell(i, j) {
    const div = document.createElement('div');
    div.className = "cell";
    div.classList.add('box');
    div.dataset.row = i;
    div.dataset.column = j;

    return div;
}

(function() {
    const fragment = document.createDocumentFragment();
    const mineMatrix = [];

    for(i=0; i<10; i++) {
        const mineMatrixRow = [];
        for(j=0; j<10; j++) {
            const div = cell(i, j);
            const mineBox = new MineBox(div, false, 0);
            mineMatrixRow.push(mineBox);
        }
        mineMatrix.push(mineMatrixRow);
    }

    for(i=0; i<mineMatrix.length; i++) {
        const row = document.createElement('div');
        row.className = 'matrix_row';

        for(j=0; j<mineMatrix[i].length; j++) {
            row.appendChild(mineMatrix[i][j].box);
        }
        fragment.appendChild(row);
    }

    for(i=0; i<10; i++) {
        random = Math.floor(Math.random()*100);
        randomx = Math.floor(random/10);
        randomy = random % 10;

        mineMatrix[randomx][randomy].box.dataset.isMine = 'true';
    }
    
    document.querySelector('#field').appendChild(fragment);

    document.querySelector('#field').addEventListener('click', ({ target }) => {
        if(target.classList.contains('cell')) {
            console.log(target);
            target.classList.remove('cell');
            target.classList.add('checked');
        }
        if(target.dataset.isMine == 'true') {
            console.log(target);
            alert('you lose.');
            window.location.reload();
        }
    });

    
})()