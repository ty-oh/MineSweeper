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
    div.dataset.isFlag = false;

    return div;
}

(function() {
    const fragment = document.createDocumentFragment();
    const mineMatrix = [];
    var totalMine = 10;
    var totalCol = 10;
    var totalRow = 10;
    var isRightPressed = false;
    var isLeftPressed = false;
    var isBothPressed = false;

    //필드 객체 생성
    for(i=0; i<totalRow; i++) {
        const mineMatrixRow = [];
        for(j=0; j<totalCol; j++) {
            const div = cell(i, j);
            const mineBox = new MineBox(div, false, 0);
            mineMatrixRow.push(mineBox);
        }
        mineMatrix.push(mineMatrixRow);
    }

    //필드 HTML 삽입
    for(i=0; i<mineMatrix.length; i++) {
        const row = document.createElement('div');
        row.className = 'matrix_row';

        for(j=0; j<mineMatrix[i].length; j++) {
            row.appendChild(mineMatrix[i][j].box);
        }
        fragment.appendChild(row);
    }

    //지뢰 생성
    for(i=0; i<totalMine; i++) {
        random = Math.floor(Math.random()*totalRow*totalCol);
        randomx = Math.floor(random/totalCol);
        randomy = random % totalCol; // ***

        mineMatrix[randomx][randomy].box.dataset.isMine = 'true';
    }
    
    document.querySelector('#field').appendChild(fragment);

    //이벤트
    document.querySelector('#field').addEventListener('click', ({ target }) => {
        if(target.classList.contains('cell')) {
            openSafeZone(target);
        }
    });

    document.querySelector('#field').addEventListener('mousedown', ({ target, which, button }) => {
        if (which == 1 || button == 0) isLeftPressed = true;
        if (which == 3 || button == 2) isRightPressed = true;

        if(isLeftPressed && isRightPressed) isBothPressed = true;
    })

    document.querySelector('#field').addEventListener('mouseup', ({ target, which, button }) => {
        if (which == 1 || button == 0) isLeftPressed = false;
        if (which == 3 || button == 2) isRightPressed = false;
        isRightClick = (which == 3) || (button == 2);

        if(target.classList.contains('checked')) {
            if(isBothPressed) openNotFlaged(target);
        }

        if(target.classList.contains('cell')) {
            if (isRightClick && !isBothPressed) flag(target);
        }

        isBothPressed = false;
        isLeftPressed = false;
        isRightPressed = false;
    });

    function flag(target) {
        if(target.dataset.isFlag === 'true') {
            target.dataset.isFlag = false;
            target.innerHTML = ``;
        } else{
            target.dataset.isFlag = true;
            target.innerHTML = `<span class="material-icons">flag</span>`;
        }
    }

    function openNotFlaged(target) {
        if (countFlags(target) != target.dataset.mineNeighbor) return;

        const row = Number(target.dataset.row);
        const col = Number(target.dataset.column);

        for(var i=-1; i<2; i++) {
            for(var j=-1; j<2; j++) {
                if (i==0 && j==0) continue;
                if (row+i<0 || row+i>totalRow-1 || col+j <0 || col+j>totalCol-1) continue;
                if ( mineMatrix[row+i][col+j].box.classList.contains('checked') ) continue;
                if ( mineMatrix[row+i][col+j].box.dataset.isFlag == 'true') continue;

                openSafeZone(mineMatrix[row+i][col+j].box);
            }
        }
    }

    function countFlags(target) {
        const row = Number(target.dataset.row);
        const col = Number(target.dataset.column);
        var cnt = 0;

        for(var i=-1; i<2; i++) {
            for(var j=-1; j<2; j++) {
                if (i==0 && j==0) continue;
                if (row+i<0 || row+i>totalRow-1 || col+j <0 || col+j>totalCol-1) continue;
                
                if ( mineMatrix[row+i][col+j].box.dataset.isFlag == 'true') cnt ++;
            }
        }
    
        return cnt;
    }

    function boxOpen(target, cntMine) {
        target.classList.remove('cell');
        target.classList.add('checked');
        target.innerText = cntMine ? cntMine : countMineNeighbor(target);
        target.dataset.mineNeighbor = cntMine;
        if (target.dataset.isMine == 'true') gameOver();
    }

    function gameOver() {
        alert('you lose.');
        window.location.reload();
    }

    function countMineNeighbor(target) {
        const row = Number(target.dataset.row);
        const col = Number(target.dataset.column);
        var cnt = 0;

        for(var i=-1; i<2; i++) {
            for(var j=-1; j<2; j++) {
                if (i==0 && j==0) continue;
                if (row+i<0 || row+i>totalRow-1 || col+j <0 || col+j>totalCol-1) continue;

                cnt += mineMatrix[row+i][col+j].box.dataset.isMine === 'true'? 1: 0;
            }
        }

        return cnt;
    }
    
    function openSafeZone(target) {
        const row = Number(target.dataset.row);
        const col = Number(target.dataset.column);
        var cnt = countMineNeighbor(target);
        boxOpen(target, cnt);
        if (cnt !== 0) return;

        for(var i=-1; i<2; i++) {
            for(var j=-1; j<2; j++) {
                if (i==0 && j==0) continue;
                if (row+i<0 || row+i>totalRow-1 || col+j <0 || col+j>totalCol-1) continue;
                if ( mineMatrix[row+i][col+j].box.classList.contains('checked') ) continue;

                openSafeZone(mineMatrix[row+i][col+j].box);
            }
        }
    }

    function check() {
        
    }


    window.oncontextmenu = function() {
        return false;
    }
})()