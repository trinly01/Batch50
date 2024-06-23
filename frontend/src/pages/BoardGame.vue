<template>

  <div class="column items-center">
    <div class="row items-center">
      <h3>{{ time }}</h3> <q-btn class="q-ml-sm" @click="resetBoard">Reset</q-btn>
    </div>
    <div style="max-width: 500px">
      <div v-for="(row, r) in grid" :key="'row' + r" class="row items-center q-gutter-sm">
        <div v-for="(cell, c) in row" :key="r + '-' + c" class="col items-center column q-gutter-sm">
          <q-btn @click="movePiece(cell)" size="lg" round :color="getColor(cell)"
            :class="{ 'text-red': cell.isFinalDestination && !cell.piece?.isPlayer && !cell.piece }"
            :icon="cell.isFinalDestination ? 'sports_score' : undefined">
            <q-badge v-if="cell.isFinalDestination" floating rounded color="red" />
          </q-btn>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useQuasar } from 'quasar'

  const $q = useQuasar()

  type Piece = {
    isPlayer: boolean,
    position: [number, number]
  }

  type Cell = {
    piece: null | Piece
    isFinalDestination?: boolean
    position: [number, number]
  }

  const grid = ref<Array<Array<Cell>>>([])

  function getColor(cell: Cell) {
    if (cell.piece === null) {
      return 'grey-3'
    } else if (cell.piece.isPlayer) {
      return 'red'
    } else {
      return 'primary'
    }
  }



  function resetBoard() {
    time.value = '00:00'
    clearInterval(timer)
    const numberOfRows = 10
    const numberOfColumns = 4


    for (let r = 0; r < numberOfRows; r++) {
      grid.value[r] = []
      for (let c = 0; c < numberOfColumns; c++) {
        grid.value[r].push({
          piece: { isPlayer: false, position: [r, c] },
          position: [r, c]
        })
      }
    }

    // randomly assign a cell a null piece to row 1 only
    grid.value[0][Math.floor(Math.random() * numberOfColumns)].isFinalDestination = true

    while (!(grid.value[numberOfRows - 1].find(cell => cell.piece?.isPlayer) && grid.value[numberOfRows - 1].find(cell => cell.piece === null))) {
      grid.value[numberOfRows - 1] = []
      for (let c = 0; c < numberOfColumns; c++) {
        grid.value[numberOfRows - 1].push({
          piece: { isPlayer: false, position: [numberOfRows - 1, c] },
          position: [numberOfRows - 1, c]
        })
      }
      grid.value[numberOfRows - 1][Math.floor(Math.random() * numberOfColumns)].piece = null
      const piecePlayer = grid.value[numberOfRows - 1][Math.floor(Math.random() * numberOfColumns)].piece
      if (piecePlayer) {
        piecePlayer.isPlayer = true
      }
    }
  }

  onMounted(() => {
    resetBoard()
  })

  const time = ref<string>('00:00') // MM:SS

  let timer: ReturnType<typeof setInterval>
  let done: boolean = false

  function start() {
    console.log('start')
    timer = setInterval(() => {
      const [minutes, seconds] = time.value.split(':');
      const newSeconds = Number(seconds) + 1;
      if (newSeconds === 60) {
        const newMinutes = Number(minutes) + 1;
        time.value = `${String(newMinutes).padStart(2, '0')}:00`;
      } else {
        time.value = `${String(minutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
      }
    }, 1000);
  }

  function movePiece(cell: Cell) {

    const piece = cell.piece

    if (piece?.position === cell.position) return

    if (done) return

    console.log(timer)
    if (!timer) {
      start()
    }

    if (piece === null) return

    const [row, col] = piece.position

    let destinationCell: Cell | null = null

    if (grid.value[row - 1]) {
      const topCell = grid.value[row - 1][col]
      if (topCell?.piece === null) {
        destinationCell = topCell
        topCell.piece = piece
        piece.position = [row - 1, col]
        grid.value[row][col].piece = null
      }
    }

    if (grid.value[row + 1]) {
      const bottomCell = grid.value[row + 1][col]
      if (bottomCell?.piece === null) {
        destinationCell = bottomCell
        bottomCell.piece = piece
        piece.position = [row + 1, col]
        grid.value[row][col].piece = null
      }
    }

    if (grid.value[row][col - 1]) {
      const leftCell = grid.value[row][col - 1]
      if (leftCell?.piece === null) {
        destinationCell = leftCell
        leftCell.piece = piece
        piece.position = [row, col - 1]
        grid.value[row][col].piece = null
      }
    }

    if (grid.value[row][col + 1]) {
      const rightCell = grid.value[row][col + 1]
      if (rightCell?.piece === null) {
        destinationCell = rightCell
        rightCell.piece = piece
        piece.position = [row, col + 1]
        grid.value[row][col].piece = null
      }
    }

    // if positions are equal for both the piece and cell, you win dialog quasar

    console.log(destinationCell)
    if (destinationCell?.position[0] === piece.position[0] && destinationCell.isFinalDestination && piece.isPlayer) {
      $q.dialog({
        title: 'Congratulations',
        message: 'You won the game',
        cancel: true,
        persistent: true
      })

      clearInterval(timer)
      done = true
    }

  }
</script>
