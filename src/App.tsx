import { Component, onMount } from 'solid-js';
import Chart from 'chart.js/auto';
import logo from './logo.svg';
import styles from './App.module.css';
import { TimeManager } from './logic/time-manager';
import { STATISTICS } from './logic/statistics';

const App: Component = () => {
  TimeManager.simulate();

  onMount(() => {
    const served = STATISTICS.served.map((served, i) => {
      return {
        day: i + 1,
        served,
      }
    });

    new Chart(
      document.getElementById('served') as HTMLCanvasElement,
      {
        type: 'bar',
        data: {
          labels: served.map(row => row.day),
          datasets: [
            {
              label: 'Выполнено заказов',
              data: served.map(row => row.served.served)
            },
            {
              label: 'Потеряно заказов',
              data: served.map(row => row.served.missed)
            }
          ]
        }
      }
    );

    const earned = STATISTICS.earned.map((earned, i) => {
      return {
        day: i + 1,
        earned
      }
    })

    new Chart(
      document.getElementById('earned') as HTMLCanvasElement,
      {
        type: 'bar',
        data: {
          labels: earned.map(row => row.day),
          datasets: [
            {
              label: 'Заработано',
              data: earned.map(row => row.earned)
            },
          ]
        }
      }
    );

  });

  return (
    <div class={styles.root}>
      <h1>За 10 дней</h1>
      <p>14 АЗС и 16 ААЗС показали следующую статистику:</p>
      <p>Автомобилисты заплатили: {Intl.NumberFormat('en', {notation: "compact"}).format(STATISTICS.earned.reduce((prev, cur) => prev + cur, 0))}</p>
      <div style="width: 800px;">
        <canvas id="served"></canvas>
      </div>
      <div style="width: 800px;">
        <canvas id="earned"></canvas>
      </div>
    </div>
  );
};

export default App;
