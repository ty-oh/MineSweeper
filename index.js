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
    div.dataset.isMine = false;

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
            if(target.dataset.isMine === 'true') {
                alert('you lose.');
                window.location.reload();
                return;
            }

            boxOpen(target);

        }
    });

    function boxOpen(target) {
        target.classList.remove('cell');
        target.classList.add('checked');
        target.innerText = countMineNeighbor(target);
    }
    function countMineNeighbor(target) {
        const row = Number(target.dataset.row);
        const col = Number(target.dataset.column);
        var cnt = 0;

        for(var i=-1; i<2; i++) {
            for(var j=-1; j<2; j++) {
                if (i==0 && j==0) continue;
                if (row+i<0 || row+i>9 || col+j <0 || col+j>9) continue;

                cnt += mineMatrix[row+i][col+j].box.dataset.isMine === 'true'? 1: 0;
                console.log(cnt);
            }
        }

        return cnt;
    }
    

    
})()