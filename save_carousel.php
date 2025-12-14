<?php
header('Content-Type: application/json');

$data_file = 'carousel_data.json';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $data !== null) {
    
    $data['last_updated'] = time(); 
    
    if (file_put_contents($data_file, json_encode($data, JSON_PRETTY_PRINT)) !== false) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Дані каруселі успішно збережено.',
            'timestamp' => $data['last_updated']
        ]);
    } else {
        http_response_code(500); 
        echo json_encode([
            'status' => 'error',
            'message' => 'Не вдалося записати дані у файл. Перевірте права доступу (наприклад, CHMOD 777) на папку проекту.'
        ]);
    }
} 

else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    if (file_exists($data_file)) {
        $content = file_get_contents($data_file);
        $carousel_data = json_decode($content, true);
        
        if ($carousel_data !== null) {
            
            if (isset($_GET['last_updated']) && isset($carousel_data['last_updated']) && 
                $_GET['last_updated'] == $carousel_data['last_updated']) {
                
                http_response_code(304); 
                echo json_encode([
                    'status' => 'not_modified',
                    'message' => 'Дані не змінилися.'
                ]);
            } else {
                echo $content;
            }
        } else {
            http_response_code(500); 
            echo json_encode([
                'status' => 'error',
                'message' => 'Помилка декодування JSON. Файл даних пошкоджено.'
            ]);
        }
    } else {
        http_response_code(404); 
        echo json_encode([
            'status' => 'error',
            'message' => 'Файл даних каруселі не знайдено. Спершу створіть його на page1.html'
        ]);
    }
} 

else {
    http_response_code(400); 
    echo json_encode([
        'status' => 'error',
        'message' => 'Невірний метод запиту або відсутні дані.'
    ]);
} 

?>
